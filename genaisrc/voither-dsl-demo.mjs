// IREAJE.cloud DSL Demonstração - Visualizador e Interpretador
// Este script demonstra o uso das DSLs do sistema IREAJE.cloud (.aje, .ire, .e)
// e sua integração com o framework HEALTH/HEALTH

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IreajeConverter } from './ireaje-format-converter.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Classe de demonstração das DSLs do IREAJE.cloud
class IreajeDSLDemo {
  constructor() {
    // Formatos implementados (práticos)
    this.practicalDSLs = {
      'aje': 'Formato JSON estruturado para eventos (implementação prática)',
      'ire': 'Formato JSON para interações detalhadas (implementação prática)',
      'e': 'Formato pipe-delimitado para eventos simplificados (implementação prática)'
    };
    
    // Formatos teóricos (prova de conceito)
    this.theoreticalDSLs = {
      'Re.aje': 'Formato Re{EventType} teórico (prova de conceito)',
      'Re.ire': 'Formato MonitorEvent.ire teórico (prova de conceito)',
      'Re.e': 'Formato Flow Euleriano teórico (prova de conceito)'
    };
    
    // Todas as extensões de DSLs suportadas
    this.practicalExtensions = Object.keys(this.practicalDSLs).map(ext => `.${ext}`);
    this.theoreticalExtensions = Object.keys(this.theoreticalDSLs).map(ext => `.${ext}`);
    this.allExtensions = [...this.practicalExtensions, ...this.theoreticalExtensions];
  }
    // Explicar os formatos das DSLs
  explainDSLs() {
    return `
📚 DSLs do IREAJE.cloud

O sistema IREAJE.cloud utiliza múltiplas Domain-Specific Languages (DSLs) para representar
e processar diferentes aspectos das interações e eventos. Estas linguagens foram projetadas
para diferentes níveis de abstração e uso:

📋 IMPLEMENTAÇÕES PRÁTICAS (UTILIZADAS NO CÓDIGO)

1. **.aje (Automated JSON Events)**
   - Formato: JSON estruturado
   - Foco: Registro detalhado de eventos individuais
   - Uso principal: Análise granular e processamento automatizado
   - Estrutura: Organizada em "session" e "events" com metadados detalhados
   - Compatibilidade: Facilmente processável por sistemas baseados em JSON

2. **.ire (Interaction Record Enhanced)**
   - Formato: JSON estruturado 
   - Foco: Interações completas (par requisição-resposta)
   - Uso principal: Análise de diálogos e rastreamento de interações
   - Estrutura: Organizada em "session" e "interactions" com detalhes de requisição/resposta
   - Compatibilidade: Ideal para visualização e análise em ferramentas de dashboard

3. **.e (Events)**
   - Formato: Texto pipe-delimitado
   - Foco: Eventos simplificados para logging compacto
   - Uso principal: Logs de sistema e processamento eficiente
   - Estrutura: Cada linha representa um evento com campos separados por pipe
   - Compatibilidade: Facilmente processável por ferramentas de linha de comando e análise de logs

📘 FORMATOS TEÓRICOS (PROVAS DE CONCEITO)

4. **Re{EventType}.aje (Registro Avançado)**
   - Formato: Definido na documentação IREAJE.cloud, implementado como prova de conceito
   - Foco: Representação formal de eventos para processamento por Runtime Euleriano
   - Status: Implementação teórica baseada na documentação

5. **MonitorEvent.ire (Correlação e Monitoramento)**
   - Formato: Definido na documentação IREAJE.cloud, implementado como prova de conceito 
   - Foco: Detecção de correlações e monitoramento de processos
   - Status: Implementação teórica baseada na documentação

6. **Flow.e (Fluxo Euleriano)**
   - Formato: Definido na documentação IREAJE.cloud, implementado como prova de conceito
   - Foco: Definição de sequências e fluxos de execução
   - Status: Implementação teórica baseada na documentação

Ambos os conjuntos de DSLs são complementares, com os formatos práticos sendo usados no código
atual, enquanto os formatos teóricos representam implementações de prova de conceito baseados
na documentação oficial do IREAJE.cloud.
`;
  }
  
  // Explicar a sintaxe específica de cada DSL
  explainSyntax(dslName) {
    dslName = dslName.toLowerCase().replace('.', '');
    
    if (dslName === 'aje') {
      return `
📝 Sintaxe da DSL .aje (Automated JSON Events)

\`\`\`json
{
  "session": {
    "id": "health-health-20250513",
    "start_time": "2025-05-13T03:26:09Z",
    "end_time": "2025-05-13T08:26:09Z",
    "user": "GUS",
    "project": "vintra-healthhealth"
  },
  "events": [
    {
      "id": "e01",
      "timestamp": "2025-05-13T03:28:05Z",
      "type": "request",
      "content": "sugestão de script para GenAI",
      "metadata": {
        "project_context": "HEALTH/HEALTH",
        "file_target": "genaisrc/.genai.mts"
      }
    },
    {
      "id": "e02",
      "timestamp": "2025-05-13T04:15:22Z",
      "type": "response",
      "content": "Script implementado com sucesso",
      "metadata": {
        "ref": "e01",
        "status": "success",
        "duration": 296
      }
    }
  ]
}
\`\`\`

Elementos principais:
- \`session\`: Informações da sessão (id, horários, usuário, projeto)
- \`events\`: Array de eventos individuais, cada um com:
  - \`id\`: Identificador único do evento
  - \`timestamp\`: Data/hora ISO8601
  - \`type\`: Tipo de evento (request, response, error, etc.)
  - \`content\`: Conteúdo principal do evento
  - \`metadata\`: Dados adicionais específicos do tipo de evento
`;
    } 
    else if (dslName === 'ire') {
      return `
📝 Sintaxe da DSL .ire (Interaction Record Enhanced)

\`\`\`json
{
  "session": {
    "id": "HEALTH-HEALTH-20250513",
    "start": "2025-05-13T03:26:09Z",
    "end": "2025-05-13T08:26:09Z",
    "user": "GUS",
    "workspace": "C:/Users/GUS/Desktop/vintra-healthhealth"
  },
  "interactions": [
    {
      "id": "INT-001",
      "timestamp": "2025-05-13T03:28:05Z",
      "request": {
        "type": "IMPLEMENTATION",
        "subject": "GenAI Script Creation",
        "target": "genaisrc/.genai.mts",
        "content": "sugestão de script para GenAI especializado para HEALTH/HEALTH"
      },
      "response": {
        "type": "CODE",
        "status": "SUCCESS",
        "content": "Script implementado para análise dimensional",
        "duration": 160
      }
    }
  ]
}
\`\`\`

Elementos principais:
- \`session\`: Informações da sessão (id, horários, usuário, workspace)
- \`interactions\`: Array de interações completas, cada uma com:
  - \`id\`: Identificador único da interação
  - \`timestamp\`: Data/hora ISO8601
  - \`request\`: Detalhes da requisição (type, subject, target, content)
  - \`response\`: Detalhes da resposta (type, status, content, duration)
`;
    } 
    else if (dslName === 'e') {
      return `
📝 Sintaxe da DSL .e (Events)

\`\`\`
EVENT_SESSION_START|2025-05-13T03:26:09Z|USER:GUS|PROJECT:vintra-healthhealth|DURATION:18000
EVENT_REQUEST|2025-05-13T03:28:05Z|TYPE:IMPLEMENTATION|TARGET:genaisrc/.genai.mts|CONTENT:sugestão de script para GenAI
EVENT_RESPONSE|2025-05-13T03:30:45Z|TYPE:CODE|STATUS:SUCCESS|DURATION:160|REF:e01
EVENT_FILE_CREATE|2025-05-13T03:40:12Z|PATH:genaisrc/.genai.mts|TYPE:SCRIPT|SIZE:4582
EVENT_SESSION_END|2025-05-13T08:33:24Z|TOTAL_INTERACTIONS:10|SUCCESS_RATE:0.9|FILES_CREATED:6|FILES_MODIFIED:2
EOF
\`\`\`

Elementos principais:
- Cada linha representa um evento
- Campos separados por pipe (|)
- Primeiro campo é o tipo de evento (EVENT_SESSION_START, EVENT_REQUEST, etc.)
- Campos subsequentes são pares chave:valor específicos do tipo de evento
- Termina com EOF

Tipos de eventos comuns:
- EVENT_SESSION_START: Início de sessão
- EVENT_SESSION_END: Fim de sessão
- EVENT_REQUEST: Solicitação do usuário
- EVENT_RESPONSE: Resposta do sistema
- EVENT_ERROR: Erro durante processamento
- EVENT_FILE_*: Operações em arquivos (CREATE, MODIFY, ACCESS)
- EVENT_COMMAND: Comandos executados
`;
    } 
    else {
      return `DSL '${dslName}' não reconhecida. DSLs suportadas: aje, ire, e`;
    }
  }
  
  // Demonstrar integração entre GenAIScript e DSLs
  explainIntegration() {
    return `
🔄 Integração GenAIScript & DSLs IREAJE.cloud

O GenAIScript e as DSLs do IREAJE.cloud trabalham em conjunto da seguinte forma:

1. **Fluxo de Trabalho**
   - O GenAIScript processa comandos com prefixo \`$\` (ex: \`$dimensoes: Valência Emocional\`)
   - O Runtime Euleriano coordena o processamento através de handlers especializados
   - As operações são registradas em logs usando os formatos DSL (.aje, .ire, .e)

2. **Transformação de Representações**
   - Vetores Dimensionais (HEALTH/HEALTH) → Expressões DSL (IREAJE.cloud)
   - Programas DSL → Trajetórias Dimensionais
   - O Compilador Dimensional-DSL atua como ponte entre estes sistemas

3. **Casos de Uso**
   - **Análise Clínica:** Registrar interações em .aje para análise detalhada
   - **Supervisão:** Converter para .ire para visualização de interações completas
   - **Auditoria:** Usar formato .e para logs compactos e fácil processamento

4. **Exemplo Prático**
   \`\`\`javascript
   // 1. Processar comando via GenAIScript
   import genai from './index.mjs';
   const resultado = await genai('$dimensoes: Valência Emocional');
   
   // 2. Registrar em formatos DSL
   import { IreajeConverter } from './ireaje-tools.mjs';
   
   // Criar registro .aje
   const ajeData = {
     session: {
       id: \`health-health-\${Date.now()}\`,
       start_time: new Date().toISOString(),
       user: "SYSTEM"
     },
     events: [
       {
         id: "e01",
         timestamp: new Date().toISOString(),
         type: "request",
         content: "$dimensoes: Valência Emocional"
       },
       {
         id: "e02",
         timestamp: new Date().toISOString(),
         type: "response",
         content: resultado.substring(0, 100) + "..."
       }
     ]
   };
   
   // Converter para outros formatos
   const ireData = IreajeConverter.ajeToIre(ajeData);
   const eContent = IreajeConverter.ireToE(ireData);
   \`\`\`

5. **Benefícios da Integração**
   - Rastreabilidade completa das interações
   - Múltiplas representações para diferentes necessidades
   - Capacidade de análise em diferentes níveis de granularidade
   - Compatibilidade com sistemas de processamento automatizado
`;
  }
  
  // Procurar exemplos no diretório
  findDSLExamples(directory = '.') {
    const examples = {};
    
    try {
      const files = fs.readdirSync(directory, { recursive: true });
      
      for (const ext of this.extensions) {
        examples[ext.substring(1)] = files
          .filter(file => file.toLowerCase().endsWith(ext))
          .map(file => path.join(directory, file));
      }
      
      return examples;
    } catch (error) {
      console.error(`Erro ao buscar exemplos: ${error.message}`);
      return {};
    }
  }
  
  // Visualizar arquivo DSL
  viewDSLFile(filePath) {
    if (!fs.existsSync(filePath)) {
      return `Arquivo não encontrado: ${filePath}`;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    if (!this.extensions.includes(ext)) {
      return `Formato não suportado: ${ext}. Formatos suportados: ${this.extensions.join(', ')}`;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Para formatos JSON, fazer parse e exibir formatado
      if (ext === '.aje' || ext === '.ire') {
        try {
          const parsed = JSON.parse(content);
          return JSON.stringify(parsed, null, 2);
        } catch (e) {
          return `Erro ao fazer parse do JSON: ${e.message}\n\nConteúdo bruto:\n${content}`;
        }
      }
      
      // Para formato .e, exibir como está
      return content;
    } catch (error) {
      return `Erro ao ler arquivo: ${error.message}`;
    }
  }
  
  // Converter arquivo entre formatos
  convertDSLFile(sourcePath, targetFormat) {
    try {
      return IreajeConverter.convertFile(sourcePath, targetFormat);
    } catch (error) {
      return `Erro ao converter: ${error.message}`;
    }
  }
}

// Exportar classe demo
export { IreajeDSLDemo };

// Função principal para linha de comando
async function main() {
  const demo = new IreajeDSLDemo();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📚 IREAJE.cloud DSL Demonstração

Uso: node ireaje-dsl-demo.mjs <comando> [parâmetros]

Comandos:
  explain                 Explicação geral das DSLs do IREAJE.cloud
  syntax <dsl>            Explicação da sintaxe de uma DSL específica (aje, ire, e)
  integration             Explicação da integração com GenAIScript
  examples [diretório]    Encontrar exemplos de arquivos DSL
  view <arquivo>          Visualizar conteúdo de um arquivo DSL
  convert <arquivo> <dsl> Converter arquivo para outro formato DSL

Exemplos:
  node ireaje-dsl-demo.mjs explain
  node ireaje-dsl-demo.mjs syntax aje
  node ireaje-dsl-demo.mjs examples ./loggin.aje.ire.e
  node ireaje-dsl-demo.mjs view ./loggin.aje.ire.e/health-health-session-log.aje
  node ireaje-dsl-demo.mjs convert ./loggin.aje.ire.e/health-health-session-log.aje ire
`);
    process.exit(0);
  }
  
  const command = args[0].toLowerCase();
  
  switch (command) {
    case 'explain':
      console.log(demo.explainDSLs());
      break;
    
    case 'syntax':
      if (args.length < 2) {
        console.error('❌ Especifique qual DSL (aje, ire, e)');
        process.exit(1);
      }
      console.log(demo.explainSyntax(args[1]));
      break;
    
    case 'integration':
      console.log(demo.explainIntegration());
      break;
    
    case 'examples':
      const directory = args[1] || '.';
      const examples = demo.findDSLExamples(directory);
      console.log('📁 Exemplos de DSLs encontrados:');
      
      for (const [format, files] of Object.entries(examples)) {
        console.log(`\n.${format} (${files.length} arquivos):`);
        for (const file of files) {
          console.log(`  - ${file}`);
        }
      }
      break;
    
    case 'view':
      if (args.length < 2) {
        console.error('❌ Especifique o caminho do arquivo');
        process.exit(1);
      }
      console.log(demo.viewDSLFile(args[1]));
      break;
    
    case 'convert':
      if (args.length < 3) {
        console.error('❌ Especifique o arquivo fonte e o formato alvo');
        process.exit(1);
      }
      const result = demo.convertDSLFile(args[1], args[2]);
      console.log(`✅ Arquivo convertido: ${result}`);
      break;
    
    default:
      console.error(`❌ Comando não reconhecido: ${command}`);
      process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
