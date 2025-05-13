// Runtime Euleriano - Simulação de integração com GenAIScript
// Este script demonstra como o GenAIScript interage com o Runtime Euleriano
// para processamento dimensional do HEALTH/HEALTH e análise via DSLs do IREAJE.cloud

import * as healthCommands from './genaisrc/health-health-commands.mts';
import { IreajeConverter } from './ireaje-tools.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simular o Runtime Euleriano
class RuntimeEuleriano {
  constructor() {
    this.handlers = new Map();
    this.sessionLog = {
      session: {
        id: `HEALTH-HEALTH-${this.getFormattedDate()}`,
        start: new Date().toISOString(),
        user: "GUS",
        workspace: process.cwd()
      },
      events: []
    };
    
    // Inicializar handlers
    this.registerHandlers();
    
    console.log('🔄 Runtime Euleriano inicializado');
  }
  
  // Registrar handlers especializados
  registerHandlers() {
    // Handler para processamento de narrativa
    this.handlers.set('NarrativaHandler', async (content) => {
      console.log('🧠 NarrativaHandler processando conteúdo...');
      return await healthCommands.default(`Análise de narrativa: ${content}`);
    });
    
    // Handler para processamento dimensional
    this.handlers.set('DimensionalHandler', async (content) => {
      console.log('📊 DimensionalHandler processando conteúdo...');
      return await healthCommands.default(`$dimensoes: ${content}`);
    });
    
    // Handler para processamento vetorial
    this.handlers.set('VetorialHandler', async (content) => {
      console.log('🔢 VetorialHandler processando conteúdo...');
      return await healthCommands.default(`$matematica: ${content}`);
    });
    
    // Handler para visualização
    this.handlers.set('VisualizacaoHandler', async (content) => {
      console.log('📈 VisualizacaoHandler processando conteúdo...');
      return await healthCommands.default(`$visualizacao: ${content}`);
    });
    
    // Handler para runtime
    this.handlers.set('RuntimeHandler', async (content) => {
      // Este handler lida com comandos relacionados ao próprio runtime
      console.log('⚙️ RuntimeHandler processando comando...');
      
      if (content.toLowerCase().includes('status')) {
        return `Runtime Euleriano está ativo com ${this.handlers.size} handlers registrados.
Sessão atual: ${this.sessionLog.session.id}
Eventos registrados: ${this.sessionLog.events.length}
Handlers: ${Array.from(this.handlers.keys()).join(', ')}`;
      }
      
      return 'Comando de runtime não reconhecido.';
    });
  }
  
  // Processar um comando
  async processCommand(command, handlerName = null) {
    // Registrar evento de requisição
    const eventId = `e${String(this.sessionLog.events.length + 1).padStart(2, '0')}`;
    
    this.sessionLog.events.push({
      id: eventId,
      timestamp: new Date().toISOString(),
      type: "request",
      content: command,
      metadata: {
        handler: handlerName || "auto",
        status: "pending"
      }
    });
    
    try {
      let result;
      
      // Se um handler específico foi especificado
      if (handlerName && this.handlers.has(handlerName)) {
        result = await this.handlers.get(handlerName)(command);
      } 
      // Se for um comando prefixado com $, usar GenAIScript diretamente
      else if (command.startsWith('$')) {
        result = await healthCommands.processarComando(command);
      }
      // Caso contrário, determinar o handler apropriado com base no conteúdo
      else {
        const handler = this.determineHandler(command);
        result = await this.handlers.get(handler)(command);
      }
      
      // Registrar evento de resposta
      this.sessionLog.events.push({
        id: `e${String(this.sessionLog.events.length + 1).padStart(2, '0')}`,
        timestamp: new Date().toISOString(),
        type: "response",
        content: typeof result === 'string' ? result.substring(0, 100) + '...' : 'Resultado não textual',
        metadata: {
          ref: eventId,
          status: "success",
          length: typeof result === 'string' ? result.length : 0
        }
      });
      
      return result;
    } catch (error) {
      // Registrar evento de erro
      this.sessionLog.events.push({
        id: `e${String(this.sessionLog.events.length + 1).padStart(2, '0')}`,
        timestamp: new Date().toISOString(),
        type: "error",
        content: error.message,
        metadata: {
          ref: eventId,
          status: "error",
          stack: error.stack
        }
      });
      
      throw error;
    }
  }
  
  // Determinar qual handler deve processar o comando
  determineHandler(command) {
    const command_lower = command.toLowerCase();
    
    if (command_lower.includes('narrativa') || command_lower.includes('história') || command_lower.includes('relato')) {
      return 'NarrativaHandler';
    }
    
    if (command_lower.includes('dimensão') || command_lower.includes('dimensional') || command_lower.includes('valência')) {
      return 'DimensionalHandler';
    }
    
    if (command_lower.includes('vetor') || command_lower.includes('cálculo') || command_lower.includes('matemática')) {
      return 'VetorialHandler';
    }
    
    if (command_lower.includes('gráfico') || command_lower.includes('radar') || command_lower.includes('visualização')) {
      return 'VisualizacaoHandler';
    }
    
    if (command_lower.includes('runtime') || command_lower.includes('status') || command_lower.includes('sistema')) {
      return 'RuntimeHandler';
    }
    
    // Default para narrativa
    return 'NarrativaHandler';
  }
  
  // Salvar log da sessão em diferentes formatos
  async saveSessionLog(directory = '.') {
    // Finalizar a sessão
    this.sessionLog.session.end = new Date().toISOString();
    
    const filename = `health-health-session-${this.getFormattedDate()}`;
    
    try {
      // Garantir que o diretório existe
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      
      // Salvar no formato .aje
      const ajePath = path.join(directory, `${filename}.aje`);
      fs.writeFileSync(ajePath, JSON.stringify(this.sessionLog, null, 2), 'utf8');
      console.log(`✅ Log .aje salvo em: ${ajePath}`);
      
      // Converter para outros formatos
      const irePath = IreajeConverter.convertFile(ajePath, 'ire');
      console.log(`✅ Log .ire salvo em: ${irePath}`);
      
      const ePath = IreajeConverter.convertFile(ajePath, 'e');
      console.log(`✅ Log .e salvo em: ${ePath}`);
      
      return {
        aje: ajePath,
        ire: irePath,
        e: ePath
      };
    } catch (error) {
      console.error('❌ Erro ao salvar logs:', error);
      throw error;
    }
  }
  
  // Obter data formatada para nome de arquivo
  getFormattedDate() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  }
}

// Exportar classe do Runtime
export { RuntimeEuleriano };

// Interface para uso via linha de comando
async function main() {
  const runtime = new RuntimeEuleriano();
  
  // Obter comando da linha de comando
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🚀 Runtime Euleriano - HEALTH/HEALTH & IREAJE.cloud
      
Uso: node runtime-euleriano.mjs "<comando>" [<handler>]
      
Exemplos:
  node runtime-euleriano.mjs "$dimensoes: Valência Emocional"
  node runtime-euleriano.mjs "Explique o conceito de Coerência Narrativa" DimensionalHandler
  node runtime-euleriano.mjs "status do sistema" RuntimeHandler
      
Para salvar logs da sessão:
  node runtime-euleriano.mjs --save-logs [diretório]
    `);
    process.exit(0);
  }
  
  // Se o comando for para salvar logs
  if (args[0] === '--save-logs') {
    const directory = args[1] || './logs';
    try {
      const result = await runtime.saveSessionLog(directory);
      console.log('📝 Logs salvos com sucesso:');
      console.log(result);
    } catch (error) {
      console.error('❌ Erro ao salvar logs:', error);
      process.exit(1);
    }
    process.exit(0);
  }
  
  const command = args[0];
  const handler = args[1] || null;
  
  try {
    console.log(`🔍 Processando comando: "${command}"${handler ? ` via ${handler}` : ''}`);
    const result = await runtime.processCommand(command, handler);
    console.log('\n📊 Resultado:\n');
    console.log(result);
    
    // Salvar logs automaticamente
    await runtime.saveSessionLog('./logs');
  } catch (error) {
    console.error('❌ Erro ao processar comando:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
