// HEALTH/HEALTH Command Bridge - Ponte para execução de comandos do framework HEALTH/HEALTH
// Este script cria uma ponte entre comandos com prefixo $ e as funções do knowledge assistant

import * as healthKnowledge from './health-health-knowledge.mts';

// Lista de comandos disponíveis e seus aliases
const COMMANDS = {
  '$fundamentos:': 'fundamentos',
  '$dimensoes:': 'dimensoes',
  '$visualizacao:': 'visualizacao',
  '$processamento:': 'processamento',
  '$documentacao:': 'documentacao',
  '$matematica:': 'matematica',
  '$ia:': 'ia',
  '$clinica:': 'clinica',
  '$exemplo:': 'exemplo',
  '$help': 'help',
  '$ajuda': 'help'
};

// Função para processar comandos com prefixo $
export async function processarComando(comando: string): Promise<string> {
  // Verificação de entrada válida
  if (!comando || typeof comando !== 'string') {
    return await healthKnowledge.help();
  }
  
  // Se for um comando de ajuda simples
  if (comando.toLowerCase() === '$help' || comando.toLowerCase() === '$ajuda') {
    return await healthKnowledge.help();
  }
  
  // Para comandos com parâmetros (formato $comando: conteúdo)
  for (const [prefix, handler] of Object.entries(COMMANDS)) {
    if (comando.startsWith(prefix)) {
      const content = comando.substring(prefix.length).trim();
      
      // Usar a função correspondente do knowledge assistant
      return await healthKnowledge.default(`${handler}: ${content}`);
    }
  }
  
  // Se nenhum comando conhecido for encontrado
  return `Comando não reconhecido: ${comando}. Use $help para ver os comandos disponíveis.`;
}

// Função principal para processar qualquer entrada
export default async function(input: string) {
  // Se for um comando começando com $, use o processador de comandos
  if (input && typeof input === 'string' && input.startsWith('$')) {
    return await processarComando(input);
  }
  
  // Para perguntas gerais, use o knowledge assistant diretamente
  return await healthKnowledge.default(input);
}
