// Script para IREAJE.cloud DSLs - Utilitário de manipulação e conversão
// Este script fornece funções para trabalhar com os formatos de DSL do IREAJE.cloud

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conversor entre os diferentes formatos de DSL
class IreajeConverter {
  /**
   * Converte de formato .aje para .ire
   * @param {Object} ajeData - Dados no formato .aje (JSON estruturado de eventos)
   * @returns {Object} - Dados no formato .ire (JSON de interações)
   */
  static ajeToIre(ajeData) {
    try {
      const sessionInfo = {
        id: ajeData.session?.id || `SESSION-${Date.now()}`,
        start: ajeData.session?.start_time || new Date().toISOString(),
        end: ajeData.session?.end_time || new Date().toISOString(),
        user: ajeData.session?.user || "SYSTEM",
        workspace: ajeData.session?.project || "UNKNOWN"
      };
      
      // Mapear eventos para interações
      const interactions = [];
      
      if (Array.isArray(ajeData.events)) {
        for (let i = 0; i < ajeData.events.length; i += 2) {
          const requestEvent = ajeData.events[i];
          const responseEvent = i + 1 < ajeData.events.length ? ajeData.events[i + 1] : null;
          
          if (!requestEvent) continue;
          
          const interaction = {
            id: `INT-${String(Math.floor(i/2) + 1).padStart(3, '0')}`,
            timestamp: requestEvent.timestamp,
            request: {
              type: requestEvent.type?.toUpperCase() || "UNKNOWN",
              subject: requestEvent.metadata?.project_context || "General Query",
              target: requestEvent.metadata?.file_target || "SYSTEM",
              content: requestEvent.content || ""
            }
          };
          
          if (responseEvent) {
            interaction.response = {
              type: responseEvent.type?.toUpperCase() || "UNKNOWN",
              status: responseEvent.metadata?.status || "UNKNOWN",
              content: responseEvent.content || "",
              duration: responseEvent.metadata?.duration || 0
            };
          }
          
          interactions.push(interaction);
        }
      }
      
      return {
        session: sessionInfo,
        interactions: interactions
      };
    } catch (error) {
      console.error('Erro ao converter de .aje para .ire:', error);
      throw error;
    }
  }
  
  /**
   * Converte de formato .ire para .e
   * @param {Object} ireData - Dados no formato .ire
   * @returns {String} - Conteúdo no formato .e (eventos pipe-delimitados)
   */
  static ireToE(ireData) {
    try {
      let lines = [];
      
      // Header de sessão
      const session = ireData.session;
      const duration = new Date(session.end) - new Date(session.start);
      
      lines.push(`EVENT_SESSION_START|${session.start}|USER:${session.user}|PROJECT:${session.workspace}|DURATION:${Math.floor(duration/1000)}`);
      
      // Interações
      if (Array.isArray(ireData.interactions)) {
        for (const interaction of ireData.interactions) {
          const req = interaction.request;
          
          // Linha de requisição
          lines.push(`EVENT_REQUEST|${interaction.timestamp}|TYPE:${req.type}|TARGET:${req.target}|CONTENT:${req.content}`);
          
          // Se houver resposta
          if (interaction.response) {
            const res = interaction.response;
            lines.push(`EVENT_RESPONSE|${interaction.timestamp}|TYPE:${res.type}|STATUS:${res.status}|DURATION:${res.duration}|REF:${interaction.id}`);
          }
        }
      }
      
      // Footer
      lines.push(`EVENT_SESSION_END|${session.end}|TOTAL_INTERACTIONS:${ireData.interactions?.length || 0}|SUCCESS_RATE:${calculateSuccessRate(ireData)}|FILES_CREATED:0|FILES_MODIFIED:0`);
      lines.push('EOF');
      
      return lines.join('\\n');
    } catch (error) {
      console.error('Erro ao converter de .ire para .e:', error);
      throw error;
    }
  }
  
  /**
   * Converte de formato .e para .aje
   * @param {String} eContent - Conteúdo no formato .e
   * @returns {Object} - Dados no formato .aje
   */
  static eToAje(eContent) {
    try {
      const lines = eContent.split('\\n').filter(line => line.trim() !== '');
      const ajeData = {
        session: {},
        events: []
      };
      
      // Processar linhas
      for (const line of lines) {
        const parts = line.split('|');
        const eventType = parts[0];
        
        if (eventType === 'EVENT_SESSION_START') {
          // Extrair informações da sessão
          const timestamp = parts[1];
          const user = parts[2].split(':')[1];
          const project = parts[3].split(':')[1];
          const duration = parseInt(parts[4].split(':')[1], 10);
          
          ajeData.session = {
            id: `${project}-${timestamp.substring(0, 10).replace(/-/g, '')}`,
            start_time: timestamp,
            end_time: calculateEndTime(timestamp, duration),
            user: user,
            project: project
          };
        } 
        else if (eventType === 'EVENT_REQUEST' || eventType === 'EVENT_RESPONSE') {
          // Criar evento
          const timestamp = parts[1];
          const type = parts[2].split(':')[1].toLowerCase();
          const target = parts[3].split(':')[1];
          const content = parts[4].split(':')[1];
          
          const event = {
            id: `e${String(ajeData.events.length + 1).padStart(2, '0')}`,
            timestamp: timestamp,
            type: type,
            content: content,
            metadata: {
              project_context: ajeData.session.project,
              file_target: target
            }
          };
          
          if (eventType === 'EVENT_RESPONSE') {
            const status = parts[4].split(':')[1];
            const duration = parseInt(parts[5].split(':')[1], 10);
            const ref = parts[6].split(':')[1];
            
            event.metadata.status = status;
            event.metadata.duration = duration;
            event.metadata.ref = ref;
          }
          
          ajeData.events.push(event);
        }
      }
      
      return ajeData;
    } catch (error) {
      console.error('Erro ao converter de .e para .aje:', error);
      throw error;
    }
  }
  
  /**
   * Converte arquivo entre formatos DSL IREAJE.cloud
   * @param {String} sourcePath - Caminho do arquivo fonte
   * @param {String} targetFormat - Formato alvo (.aje, .ire, ou .e)
   * @returns {String} - Caminho do arquivo convertido
   */
  static convertFile(sourcePath, targetFormat) {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Arquivo não encontrado: ${sourcePath}`);
    }
    
    const sourceExt = path.extname(sourcePath).toLowerCase();
    const sourceFormat = sourceExt.substring(1); // Remover ponto inicial
    
    if (sourceFormat === targetFormat) {
      console.log(`O arquivo já está no formato ${targetFormat}`);
      return sourcePath;
    }
    
    // Ler arquivo fonte
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    let sourceData;
    
    if (sourceFormat === 'aje' || sourceFormat === 'ire') {
      sourceData = JSON.parse(sourceContent);
    } else if (sourceFormat === 'e') {
      sourceData = sourceContent;
    } else {
      throw new Error(`Formato não suportado: ${sourceFormat}`);
    }
    
    // Converter dados
    let targetData;
    switch (sourceFormat + '_to_' + targetFormat) {
      case 'aje_to_ire':
        targetData = this.ajeToIre(sourceData);
        break;
      case 'ire_to_e':
        targetData = this.ireToE(sourceData);
        break;
      case 'e_to_aje':
        targetData = this.eToAje(sourceData);
        break;
      case 'ire_to_aje':
        // Converter .ire para .e e depois para .aje
        const eContent = this.ireToE(sourceData);
        targetData = this.eToAje(eContent);
        break;
      case 'aje_to_e':
        // Converter .aje para .ire e depois para .e
        const ireData = this.ajeToIre(sourceData);
        targetData = this.ireToE(ireData);
        break;
      default:
        throw new Error(`Conversão não suportada: ${sourceFormat} para ${targetFormat}`);
    }
    
    // Gerar caminho do arquivo de saída
    const targetPath = sourcePath.replace(sourceExt, `.${targetFormat}`);
    
    // Escrever arquivo de saída
    if (targetFormat === 'aje' || targetFormat === 'ire') {
      fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), 'utf8');
    } else {
      fs.writeFileSync(targetPath, targetData, 'utf8');
    }
    
    return targetPath;
  }
}

// Funções auxiliares
function calculateEndTime(startTime, durationSeconds) {
  const startDate = new Date(startTime);
  return new Date(startDate.getTime() + durationSeconds * 1000).toISOString();
}

function calculateSuccessRate(ireData) {
  if (!Array.isArray(ireData.interactions) || ireData.interactions.length === 0) {
    return 0;
  }
  
  const successfulInteractions = ireData.interactions.filter(
    int => int.response && int.response.status === 'SUCCESS'
  ).length;
  
  return (successfulInteractions / ireData.interactions.length).toFixed(1);
}

// Exportar classe converter
export { IreajeConverter };

// Expor uma função para usar via linha de comando
export async function convertIreajeFormat(sourcePath, targetFormat) {
  if (!sourcePath || !targetFormat) {
    console.error('Uso: node ireaje-tools.mjs <arquivo-fonte> <formato-alvo>');
    console.error('Formatos suportados: aje, ire, e');
    return;
  }
  
  try {
    const result = IreajeConverter.convertFile(sourcePath, targetFormat);
    console.log(`✅ Arquivo convertido com sucesso: ${result}`);
    return result;
  } catch (error) {
    console.error(`❌ Erro ao converter arquivo: ${error.message}`);
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, sourcePath, targetFormat] = process.argv;
  
  if (!sourcePath || !targetFormat) {
    console.log('📊 IREAJE.cloud DSL Converter');
    console.log('Uso: node ireaje-tools.mjs <arquivo-fonte> <formato-alvo>');
    console.log('Formatos suportados: aje, ire, e');
    process.exit(1);
  }
  
  try {
    const result = await convertIreajeFormat(sourcePath, targetFormat);
    console.log(`Arquivo convertido: ${result}`);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
}
