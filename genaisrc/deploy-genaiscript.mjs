// Este script instala as dependências necessárias e configura o GenAIScript
// para uso no contexto do HEALTH/HEALTH e IREAJE.cloud

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Iniciando implantação do GenAIScript para HEALTH/HEALTH...');

// Verificar dependências necessárias
const dependencies = ['typescript', 'ts-node', 'nodemon'];
const packageJsonPath = path.join(__dirname, 'package.json');

// Criar package.json se não existir
if (!fs.existsSync(packageJsonPath)) {
  console.log('📝 Criando package.json...');
  
  const packageJson = {
    "name": "health-health-genaiscript",
    "version": "1.0.0",
    "description": "GenAIScript para framework HEALTH/HEALTH e IREAJE.cloud",
    "type": "module",
    "main": "index.mjs",
    "scripts": {
      "start": "node index.mjs",
      "dev": "nodemon index.mjs",
      "test": "node test-genai.mjs"
    },
    "author": "GUS",
    "license": "MIT",
    "dependencies": {},
    "devDependencies": {}
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json criado com sucesso!');
}

// Instalar dependências
console.log('📦 Instalando dependências necessárias...');
try {
  for (const dep of dependencies) {
    console.log(`📦 Instalando ${dep}...`);
    execSync(`npm install --save-dev ${dep}`, { stdio: 'inherit' });
  }
  console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error);
  process.exit(1);
}

// Criar arquivo index.mjs para facilitar uso
const indexPath = path.join(__dirname, 'index.mjs');
if (!fs.existsSync(indexPath)) {
  console.log('📝 Criando arquivo index.mjs...');
  
  const indexContent = `// HEALTH/HEALTH GenAIScript - Interface Unificada
import healthCommands from './genaisrc/health-health-commands.mts';
import { processarComando } from './genaisrc/health-health-commands.mts';

// Comandos disponíveis para referência rápida
const COMANDOS = {
  '$fundamentos:': 'Informações sobre fundamentos do framework HEALTH/HEALTH',
  '$dimensoes:': 'Explicações sobre as dimensões do espaço mental',
  '$visualizacao:': 'Detalhes sobre o sistema de visualização (radar dimensional, etc.)',
  '$processamento:': 'Informações sobre o pipeline de processamento',
  '$documentacao:': 'Acesso à documentação do HEALTH/HEALTH',
  '$matematica:': 'Explicações sobre os fundamentos matemáticos',
  '$ia:': 'Informações sobre integração com IA',
  '$clinica:': 'Detalhes de aplicação clínica',
  '$exemplo:': 'Exemplos de uso',
  '$help': 'Lista todos os comandos disponíveis',
  '$ajuda': 'Alias para $help'
};

export { COMANDOS };

// Expor função processarComando como principal
export default async function(comando) {
  return await processarComando(comando);
}

// Se executado diretamente, mostrar informações de uso
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  console.log('📊 HEALTH/HEALTH GenAIScript - Interface de Comandos');
  console.log('Comandos disponíveis:');
  
  for (const [cmd, desc] of Object.entries(COMANDOS)) {
    console.log(\`  \${cmd} \${desc}\`);
  }
  
  console.log('\\nExemplo de uso:');
  console.log('  const genai = await import("./index.mjs");');
  console.log('  const resposta = await genai.default("$dimensoes: Valência Emocional");');
}
`;
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ index.mjs criado com sucesso!');
}

// Criar interface CLI para facilitar uso via linha de comando
const cliPath = path.join(__dirname, 'cli.mjs');
if (!fs.existsSync(cliPath)) {
  console.log('📝 Criando interface CLI...');
  
  const cliContent = `#!/usr/bin/env node
// CLI para HEALTH/HEALTH GenAIScript

import { processarComando } from './genaisrc/health-health-commands.mts';

async function main() {
  // Obter comando da linha de comando
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('❌ Nenhum comando fornecido. Use $help para ver comandos disponíveis.');
    console.log('Exemplo: node cli.mjs "$fundamentos: O que é HEALTH/HEALTH?"');
    process.exit(1);
  }
  
  // Reconstruir o comando completo (caso tenha espaços)
  const comando = args.join(' ');
  
  try {
    console.log('🔍 Processando comando:', comando);
    const resultado = await processarComando(comando);
    console.log('\\n📊 Resultado:\\n');
    console.log(resultado);
  } catch (error) {
    console.error('❌ Erro ao processar comando:', error);
    process.exit(1);
  }
}

main();
`;
  
  fs.writeFileSync(cliPath, cliContent);
  console.log('✅ CLI criado com sucesso!');
}

// Criar arquivo README.md com instruções de uso
const readmePath = path.join(__dirname, 'GENAISCRIPT-README.md');
if (!fs.existsSync(readmePath)) {
  console.log('📝 Criando documentação...');
  
  const readmeContent = `# GenAIScript para HEALTH/HEALTH

Este é um sistema de interface de comandos específico para o framework HEALTH/HEALTH e integração com IREAJE.cloud.

## Instalação

\`\`\`bash
npm install
\`\`\`

## Uso Básico

### Via CLI

\`\`\`bash
node cli.mjs "$fundamentos: O que é o HEALTH/HEALTH?"
\`\`\`

### Em Código JavaScript

\`\`\`javascript
import genai from './index.mjs';

async function main() {
  // Uso com comando específico
  const resultado = await genai('$dimensoes: Explique a Valência Emocional');
  console.log(resultado);
  
  // Consulta geral (sem prefixo $)
  const resposta = await genai('Como o radar dimensional representa a intensidade afetiva?');
  console.log(resposta);
}

main();
\`\`\`

## Comandos Disponíveis

- \`$fundamentos:\` - Informações sobre fundamentos do framework HEALTH/HEALTH
- \`$dimensoes:\` - Explicações sobre as dimensões do espaço mental
- \`$visualizacao:\` - Detalhes sobre o sistema de visualização (radar dimensional, etc.)
- \`$processamento:\` - Informações sobre o pipeline de processamento
- \`$documentacao:\` - Acesso à documentação do HEALTH/HEALTH
- \`$matematica:\` - Explicações sobre os fundamentos matemáticos
- \`$ia:\` - Informações sobre integração com IA
- \`$clinica:\` - Detalhes de aplicação clínica
- \`$exemplo:\` - Exemplos de uso
- \`$help\` - Lista todos os comandos disponíveis
- \`$ajuda\` - Alias para $help

## Integração com Runtime Euleriano

O GenAIScript se integra ao Runtime Euleriano através do sistema de handlers, permitindo processamento especializado para diferentes tipos de consultas.

## Relação com DSLs do IREAJE.cloud

O GenAIScript facilita a tradução entre o modelo vetorial-dimensional do HEALTH/HEALTH e as diversas DSLs:

- \`.aje\` - Formato JSON para eventos estruturados
- \`.ire\` - Formato JSON para interações detalhadas
- \`.e\` - Formato pipe-delimitado para eventos simplificados

Para mais informações, consulte a documentação completa do HEALTH/HEALTH e IREAJE.cloud.
\`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('✅ Documentação criada com sucesso!');
}

console.log('🎉 Implantação do GenAIScript concluída!');
console.log('Para usar, execute:');
console.log('  node cli.mjs "$help"');
console.log('Ou importe em seu código:');
console.log('  import genai from "./index.mjs";');
