# GenAIScript para ZEOCARE & VOITHER

Este repositório contém um conjunto de ferramentas para trabalhar com o framework ZEOCARE e as DSLs do VOITHER através do GenAIScript - uma interface especializada para consulta e processamento de conhecimento dimensional.

## 📋 Componentes Principais

- **GenAIScript**: Interface de consulta vetorial-dimensional via comandos prefixados com `$`
- **Runtime Euleriano**: Orquestrador de fluxo para processamento multi-agente
- **DSLs VOITHER**: Linguagens específicas de domínio para representação de eventos e interações:
  - `.aje`: Formato JSON estruturado para eventos
  - `.ire`: Formato JSON para interações detalhadas
  - `.e`: Formato pipe-delimitado para eventos simplificados

## 🚀 Implantação e Configuração

### Pré-requisitos

- Node.js v16 ou superior
- npm v7 ou superior

### Instalação

1. Clone o repositório e execute o script de implantação:

```bash
cd c:\Users\GUS\Desktop\myself.gus.repos
node deploy-genaiscript.mjs
```

Isto irá:
- Instalar dependências necessárias
- Configurar arquivos principais para uso
- Criar documentação e interface de linha de comando

## 🔍 Como Usar o GenAIScript

### Via Linha de Comando

```bash
# Usando o CLI direto
node cli.mjs "$dimensoes: Explique a Valência Emocional"

# Ou via teste
node test-genai.mjs
```

### Em Código JavaScript

```javascript
import genai from './index.mjs';

async function main() {
  // Usando comando específico
  const resultado = await genai('$dimensoes: Valência Emocional');
  console.log(resultado);
  
  // Consulta geral (sem prefixo $)
  const resposta = await genai('Como o radar dimensional representa a Intensidade Afetiva?');
  console.log(resposta);
}

main();
```

### Comandos Disponíveis

- `$fundamentos:` - Informações sobre fundamentos do framework ZEOCARE
- `$dimensoes:` - Explicações sobre as 10 dimensões do espaço mental
- `$visualizacao:` - Detalhes sobre o sistema de visualização (radar dimensional, etc.)
- `$processamento:` - Informações sobre o pipeline de processamento
- `$documentacao:` - Acesso à documentação do ZEOCARE
- `$matematica:` - Explicações sobre os fundamentos matemáticos
- `$ia:` - Informações sobre integração com IA
- `$clinica:` - Detalhes de aplicação clínica
- `$exemplo:` - Exemplos de uso
- `$help` ou `$ajuda` - Lista todos os comandos disponíveis

## ⚙️ Runtime Euleriano

O Runtime Euleriano coordena o processamento de comandos através de handlers especializados. Para utilizá-lo:

```bash
# Ver comandos disponíveis
node runtime-euleriano.mjs

# Executar um comando específico
node runtime-euleriano.mjs "$dimensoes: Valência Emocional"

# Direcionar para um handler específico
node runtime-euleriano.mjs "Análise de trajetória do paciente" VetorialHandler

# Verificar status do sistema
node runtime-euleriano.mjs "status do sistema" RuntimeHandler

# Salvar logs da sessão
node runtime-euleriano.mjs --save-logs ./logs
```

Os logs serão salvos automaticamente no diretório `./logs` nos formatos `.aje`, `.ire` e `.e`.

## 🔄 DSLs VOITHER

O sistema usa três DSLs complementares para registro e processamento de eventos:

### Ferramentas para DSLs

#### Conversor entre formatos

```bash
# Converter entre formatos DSL
node ireaje-tools.mjs ./logs/health-health-session-20250513.aje ire
```

#### Demonstração e Documentação

```bash
# Ver documentação geral sobre as DSLs
node ireaje-dsl-demo.mjs explain

# Explorar a sintaxe de uma DSL específica
node ireaje-dsl-demo.mjs syntax aje

# Encontrar exemplos de arquivos DSL em um diretório
node ireaje-dsl-demo.mjs examples ./loggin.aje.ire.e

# Visualizar arquivo DSL
node ireaje-dsl-demo.mjs view ./loggin.aje.ire.e/health-health-session-log.aje

# Converter arquivo para outro formato
node ireaje-dsl-demo.mjs convert ./loggin.aje.ire.e/health-health-session-log.aje ire
```

### Uso em Código

```javascript
import { IreajeConverter } from './ireaje-tools.mjs';

// Converter arquivo entre formatos
const irePath = IreajeConverter.convertFile('logs/session.aje', 'ire');
const ePath = IreajeConverter.convertFile('logs/session.ire', 'e');

// Converter dados diretamente
const ireData = IreajeConverter.ajeToIre(ajeObject);
const eContent = IreajeConverter.ireToE(ireObject);
const ajeObject = IreajeConverter.eToAje(eContent);
```

## 📊 Arquitetura do Sistema

O sistema integra múltiplos componentes:

1. **GenAIScript**: Interface para comandos e consultas
2. **Runtime Euleriano**: Orquestrador de fluxo e processamento
3. **Handlers Especializados**: Processadores para diferentes tipos de consultas
4. **DSLs VOITHER**: Linguagens para representação e persistência
5. **Compilador Dimensional-DSL**: Ponte entre representações vetoriais e DSLs

## 📚 Recursos Adicionais

- [Documentação Completa do ZEOCARE](health.health/hh-manual-tecnico.md)
- [Especificações Técnicas](health.health/hh-especificacoes-tecnicas.md)
- [Pipeline de Processamento](health.health/hh-pipeline-embeddings-ontologias-grafos.md)
- [Manual do VOITHER](Voither.summary/Voither.mathexplain/IREAJE.CLOUD.md)

## 🤝 Contribuição

Para contribuir com este projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para sua branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT.
