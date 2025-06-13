# IREAJE.NET Technical Manual
## .aje, .ire, and .e Language Specifications

Version 1.0.0 | 2025-04-26

---

## Table of Contents

1. [Introduction](#introduction)
2. [Ecosystem Overview](#ecosystem-overview)
3. [.aje - Actions & Journey Events](#aje)
   - [Core Concepts](#aje-core-concepts)
   - [Syntax Specification](#aje-syntax)
   - [Event Types](#aje-event-types)
   - [Implementation Guidelines](#aje-implementation)
4. [.ire - Intelligent Relational Events](#ire)
   - [Core Concepts](#ire-core-concepts)
   - [Syntax Specification](#ire-syntax)
   - [Correlation Rules](#ire-correlation-rules)
   - [Implementation Guidelines](#ire-implementation)
5. [.e - Eulerian Runtime Language](#e)
   - [Core Concepts](#e-core-concepts)
   - [Syntax Specification](#e-syntax)
   - [Execution Policies](#e-execution-policies)
   - [Implementation Guidelines](#e-implementation)
6. [Ecosystem Integration](#ecosystem-integration)
   - [Data Flow Architecture](#data-flow-architecture)
   - [Runtime Interaction](#runtime-interaction)
   - [Event Processing Pipeline](#event-processing-pipeline)
7. [Technical Implementation](#technical-implementation)
   - [C# & F# Implementation](#csharp-fsharp)
   - [Azure Infrastructure](#azure-infrastructure)
   - [Performance Considerations](#performance)
8. [Domain-Specific Adaptations](#domain-adaptations)
   - [Healthcare](#healthcare)
   - [Industrial Systems](#industrial)
   - [Security Applications](#security)
   - [Educational Contexts](#education)
9. [Appendices](#appendices)
   - [Grammar Specifications](#grammar)
   - [Reference Implementations](#reference)
   - [Conversion Tools](#conversion)

---

<a id="introduction"></a>
## 1. Introduction

The IREAJE.NET ecosystem presents a trio of complementary languages designed to handle different aspects of event processing, monitoring, and execution flow control. Together, they form a comprehensive framework for building efficient, privacy-preserving, and modular systems across multiple domains.

This technical manual serves as the authoritative specification for:

- `.aje` - Actions & Journey Events language
- `.ire` - Intelligent Relational Events language
- `.e` - Eulerian Runtime language

These three languages operate in a complementary fashion, with `.aje` capturing structured events, `.ire` monitoring correlations between events, and `.e` orchestrating efficient execution paths through the system.

---

<a id="ecosystem-overview"></a>
## 2. Ecosystem Overview

The IREAJE.NET ecosystem follows a layered architecture where each language serves a specific purpose:

```
┌─────────────────────────────────────────┐
│ Input Sources (Text, Audio, Sensors...) │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│   .aje - Actions & Journey Events       │
│   (Event Capture & Structuring)         │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│   .ire - Intelligent Relational Events  │
│   (Pattern Monitoring & Response)       │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│   .e - Eulerian Runtime Language        │
│   (Execution Flow Orchestration)        │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│ Output Actions (Alerts, Updates, APIs)  │
└─────────────────────────────────────────┘
```

**Key Principles:**

1. **Separation of Concerns**: Each language has a focused purpose
2. **Data Flow Integrity**: Clean interfaces between layers
3. **Eulerian Efficiency**: Visit each node exactly once when possible
4. **Privacy by Design**: Operate on correlations, not identities
5. **Modularity**: Each component can evolve independently

---

<a id="aje"></a>
## 3. .aje - Actions & Journey Events

<a id="aje-core-concepts"></a>
### 3.1 Core Concepts

`.aje` is the foundation language of the IREAJE.NET ecosystem, responsible for capturing and structuring events into a navigable graph. It serves as the perception layer, transforming inputs into structured events.

**Key Features:**
- Event representation as discreet, typed nodes
- Structured parameters with strong typing
- Support for relationships between events
- Immutability of recorded events
- Identity-optional design

<a id="aje-syntax"></a>
### 3.2 Syntax Specification

The `.aje` language follows a consistent syntax pattern:

```
Re{EventType}.aje:{
  "parameter1": value1,
  "parameter2": value2,
  ...
}
```

**Elements:**
- `Re{EventType}` - The type of event being recorded
- `.aje:` - The language marker
- JSON object - Parameters specific to the event type

**Example:**
```
Re{RegistrarSintoma}.aje:{
  "Sintoma": "Dor torácica",
  "Duracao": "2 dias",
  "Intensidade": "Moderada",
  "Timestamp": "2025-04-26T10:15:30Z",
  "ContextoId": "consulta-123"
}
```

<a id="aje-event-types"></a>
### 3.3 Event Types

`.aje` supports a flexible type system for events, with some core types:

| Event Category | Examples | Description |
|----------------|----------|-------------|
| Input Events | `RegistrarEntrada`, `CapturarDado` | Initial data capture events |
| State Events | `AlterarEstado`, `DefinirStatus` | Record changes in state |
| Action Events | `ExecutarAcao`, `EnviarNotificacao` | Record actions taken |
| Relation Events | `AssociarEntidades`, `DefinirRelacao` | Establish connections |
| Lifecycle Events | `IniciarProcesso`, `EncerrarSessao` | Track entity lifecycles |

Events can be extended for domain-specific needs while maintaining the core syntax.

<a id="aje-implementation"></a>
### 3.4 Implementation Guidelines

**Parser Implementation:**
C# is recommended for implementing `.aje` parsers due to its strong type system and performance characteristics. A typical parser should:

1. Validate syntax against the `.aje` grammar
2. Extract event type and parameters
3. Type-check parameters against event schema
4. Create immutable event objects
5. Store events in a graph-oriented data structure

**Storage Considerations:**
- Use a graph database (e.g., CosmosDB with Gremlin API)
- Index events by type and key parameters
- Maintain relation links between events
- Consider time-series optimizations for temporal queries

---

<a id="ire"></a>
## 4. .ire - Intelligent Relational Events

<a id="ire-core-concepts"></a>
### 4.1 Core Concepts

`.ire` operates as the monitoring and response layer of the IREAJE.NET ecosystem. It observes streams of `.aje` events, detects meaningful patterns or correlations, and triggers appropriate responses when conditions are met.

**Key Features:**
- Pattern recognition across multiple events
- Threshold-based alerting
- Temporal correlation detection
- Action emission based on detected patterns
- Privacy-preserving correlation without direct identities

<a id="ire-syntax"></a>
### 4.2 Syntax Specification

The `.ire` language follows this syntax pattern:

```
MonitorarEvento.ire:{
  "NomeFluxo": "FlowName",
  "CorrelacoesDetectadas": ["Event1", "Event2", ...],
  "NivelCriticidade": "Level",
  "AcoesAutomatizadas": ["Action1", "Action2", ...],
  "PoliticaDeResposta": "ResponsePolicy",
  "Persistencia": "PersistenceRule"
}
```

**Elements:**
- `MonitorarEvento` - Standard monitor declaration
- `.ire:` - The language marker
- JSON object - Parameters defining monitoring behavior

**Example:**
```
MonitorarEvento.ire:{
  "NomeFluxo": "Risco Cardiovascular Agudo",
  "CorrelacoesDetectadas": ["Dor torácica", "Hipertensão", "Dispneia"],
  "NivelCriticidade": "Muito Alto",
  "AcoesAutomatizadas": ["Solicitar ECG urgente", "Encaminhar para emergência"],
  "PoliticaDeResposta": "Ação Imediata",
  "Persistencia": "Até estabilização clínica confirmada"
}
```

<a id="ire-correlation-rules"></a>
### 4.3 Correlation Rules

`.ire` supports several types of correlation rules:

| Rule Type | Description | Example |
|-----------|-------------|---------|
| Co-occurrence | Events happening together | Symptoms appearing simultaneously |
| Sequence | Events in specific order | Login followed by unusual access pattern |
| Threshold | Quantitative limits | Temperature exceeding safety limits |
| Temporal | Time-based patterns | Recurring events at specific intervals |
| Complex | Combinations of other rules | Specific sequence with timing constraints |

Rules can be expressed using a combination of exact matches, regular expressions, and statistical thresholds.

<a id="ire-implementation"></a>
### 4.4 Implementation Guidelines

**Monitor Implementation:**
F# is recommended for implementing `.ire` monitors due to its strength in functional composition and pattern matching. A typical implementation should:

1. Subscribe to `.aje` event streams
2. Apply correlation rules to incoming events
3. Maintain state for partial pattern matches
4. Trigger actions when patterns are fully matched
5. Manage persistence of detected conditions

**Optimization Considerations:**
- Minimize state kept in memory
- Use sliding windows for temporal correlations
- Consider probabilistic data structures for high-volume streams
- Implement back-pressure mechanisms for event bursts

---

<a id="e"></a>
## 5. .e - Eulerian Runtime Language

<a id="e-core-concepts"></a>
### 5.1 Core Concepts

`.e` is the orchestration layer of the IREAJE.NET ecosystem, responsible for defining how execution flows through the system. It applies Eulerian principles—visiting each node exactly once when possible—to optimize performance and clarity.

**Key Features:**
- Declarative flow definition
- Single-pass execution paths
- Conditional branching and interruption
- Completion actions and cleanup
- Lightweight syntax for human readability

<a id="e-syntax"></a>
### 5.2 Syntax Specification

The `.e` language follows this syntax pattern:

```
Fluxo: <nome_do_fluxo>
Inicio: <evento_inicial>
Sequencia:
  - <evento_1>
  - <evento_2>
  - <evento_3>
PoliticaVisita: <regra_de_percorrer>
CondicoesInterrupcao:
  - <condicao_1>
  - <condicao_2>
AcoesAoFinalizar:
  - <acao_1>
  - <acao_2>
```

**Elements:**
- `Fluxo:` - Flow identifier
- `Inicio:` - Starting event
- `Sequencia:` - Ordered list of events to process
- `PoliticaVisita:` - Traversal policy (usually `PercorrerUnico`)
- `CondicoesInterrupcao:` - Conditions that halt execution
- `AcoesAoFinalizar:` - Actions triggered on completion

**Example:**
```
Fluxo: DiagnosticoCardiaco
Inicio: RegistrarSintoma
Sequencia:
  - VerificarHistorico
  - AguardarExames
  - AnalisarResultados
  - EmitirConclusao
PoliticaVisita: PercorrerUnico
CondicoesInterrupcao:
  - ExameInconclusivo
AcoesAoFinalizar:
  - GerarRelatorio
  - NotificarPaciente
```

<a id="e-execution-policies"></a>
### 5.3 Execution Policies

`.e` supports several execution policies:

| Policy | Description | Use Case |
|--------|-------------|----------|
| `PercorrerUnico` | Visit each node exactly once | Standard efficient execution |
| `PercorrerComRedundanciaControlada` | Allow limited revisits | When state verification is critical |
| `PercorrerParalelo` | Execute independent branches in parallel | For performance on separate paths |
| `PercorrerCondicional` | Choose path based on runtime conditions | Decision-based processing |

<a id="e-implementation"></a>
### 5.4 Implementation Guidelines

**Runtime Implementation:**
F# is recommended for implementing `.e` runtimes due to its strength in functional composition and immutability. A typical implementation should:

1. Parse `.e` flow definitions
2. Build execution graphs
3. Track traversal state
4. Enforce visitation policies
5. Manage interruptions and completion actions

**Performance Considerations:**
- Use lightweight task scheduling
- Minimize context switching
- Consider persistent data structures for efficient state updates
- Implement flow caching for frequently used patterns

---

<a id="ecosystem-integration"></a>
## 6. Ecosystem Integration

<a id="data-flow-architecture"></a>
### 6.1 Data Flow Architecture

The IREAJE.NET ecosystem integrates the three languages into a coherent data flow:

```
[Input Sources] → [Parser] → Re{Events}.aje → [Event Store]
                                   ↓
[Pattern Rules] → [Monitor] → MonitorarEvento.ire → [Alert System]
                                   ↓
[Flow Definitions] → [Runtime] → Fluxo.e → [Action Execution]
```

This architecture ensures that:
1. Data is captured and structured with `.aje`
2. Patterns are detected with `.ire`
3. Execution is optimized with `.e`

<a id="runtime-interaction"></a>
### 6.2 Runtime Interaction

The three languages interact through well-defined interfaces:

1. `.aje` → `.ire`:
   - Event streams are published
   - Monitors subscribe to relevant event types
   - Pattern detection runs continuously

2. `.ire` → `.e`:
   - Detected patterns trigger flow execution
   - Correlation context is passed to flows
   - Runtime status is reported back

3. `.e` → `.aje`:
   - Flow execution generates new events
   - Cycle can continue with new event patterns

<a id="event-processing-pipeline"></a>
### 6.3 Event Processing Pipeline

A typical event processing pipeline in the IREAJE.NET ecosystem:

1. **Input Capture:**
   - Natural language, sensor data, or API calls arrive
   - Parser converts to `.aje` events

2. **Event Storage:**
   - Events are stored in graph database
   - Relations are established between events

3. **Pattern Monitoring:**
   - `.ire` monitors observe event streams
   - Patterns are detected based on rules

4. **Alert & Response:**
   - Alerts generated for critical patterns
   - Actions triggered automatically

5. **Flow Execution:**
   - `.e` runtime orchestrates response flows
   - Eulerian traversal ensures efficiency

6. **Feedback Loop:**
   - Actions generate new events
   - System continually evolves

---

<a id="technical-implementation"></a>
## 7. Technical Implementation

<a id="csharp-fsharp"></a>
### 7.1 C# & F# Implementation

The recommended implementation strategy divides responsibilities:

| Language | Component | Reasoning |
|----------|-----------|-----------|
| **C#** | `.aje` Parser | Strong typing, performance |
| **C#** | Storage Layer | Rich ecosystem of database drivers |
| **F#** | `.ire` Monitor | Pattern matching, functional composition |
| **F#** | `.e` Runtime | Immutability, flow control |
| **C#** | API Layer | Industry standard for APIs |

Typical implementation involves:

```
/AjeEvents/                (C# Project)
/IreMonitoring/            (F# Project)
/EFlowOrchestration/       (F# Project)
/RuntimeCore/              (C# Project)
/API/                      (C# Project)
/Infrastructure/           (C# Project)
```

<a id="azure-infrastructure"></a>
### 7.2 Azure Infrastructure

The IREAJE.NET ecosystem is designed to leverage Azure services:

| Component | Azure Service | Purpose |
|-----------|---------------|---------|
| Event Storage | CosmosDB (Gremlin API) | Graph storage for `.aje` events |
| Event Processing | Azure Functions | Serverless execution of monitors |
| Event Bus | Event Grid | Message passing between components |
| Runtime State | Azure Redis Cache | Fast state tracking for `.e` runtime |
| API Layer | Azure API Management | Endpoint management |
| Monitoring | Application Insights | System health and performance |

<a id="performance"></a>
### 7.3 Performance Considerations

Optimizing the IREAJE.NET ecosystem:

1. **Event Processing:**
   - Batch processing for high-volume streams
   - Event filtering at source when possible
   - Compression for network transfer

2. **Pattern Detection:**
   - Probabilistic data structures for high-cardinality patterns
   - Hierarchical pattern matching for efficiency
   - Early abandonment of unlikely matches

3. **Flow Execution:**
   - Caching of frequently used flows
   - Lazy evaluation of conditional branches
   - Parallelization of independent steps

4. **NVIDIA Acceleration (Optional):**
   - Vector operations for embeddings
   - Parallel pattern matching for complex rules
   - ML model inference for predictive patterns

---

<a id="domain-adaptations"></a>
## 8. Domain-Specific Adaptations

<a id="healthcare"></a>
### 8.1 Healthcare

In healthcare applications, the IREAJE.NET ecosystem is adapted for:

**`.aje` Events:**
```
Re{RegistrarSintoma}.aje:{
  "Sintoma": "Dor torácica",
  "Duracao": "2 dias",
  "Intensidade": "Moderada"
}

Re{ResultadoExame}.aje:{
  "Exame": "ECG",
  "Resultado": "Alteração ST",
  "DataHora": "2025-04-26T14:30:00Z"
}
```

**`.ire` Monitoring:**
```
MonitorarEvento.ire:{
  "NomeFluxo": "Risco Cardiovascular Agudo",
  "CorrelacoesDetectadas": ["Dor torácica", "Alteração ST"],
  "NivelCriticidade": "Muito Alto",
  "AcoesAutomatizadas": ["Solicitar Troponina", "Alertar Cardiologista"]
}
```

**`.e` Flow:**
```
Fluxo: ProtocoloSindromeCoronariana
Inicio: IdentificarRiscoCardiovascular
Sequencia:
  - SolicitarMarcadoresCardiacos
  - AvaliarRisultados
  - DefinirConduta
PoliticaVisita: PercorrerUnico
CondicoesInterrupcao:
  - ResultadosNormais
AcoesAoFinalizar:
  - DocumentarProtocolo
```

<a id="industrial"></a>
### 8.2 Industrial Systems

In industrial applications, the IREAJE.NET ecosystem is adapted for:

**`.aje` Events:**
```
Re{RegistrarTemperatura}.aje:{
  "Equipamento": "Forno-01",
  "Temperatura": 450.5,
  "Unidade": "Celsius",
  "Timestamp": "2025-04-26T08:15:22Z"
}

Re{RegistrarVibracao}.aje:{
  "Equipamento": "Forno-01",
  "NivelVibracao": "Alto",
  "Timestamp": "2025-04-26T08:16:05Z"
}
```

**`.ire` Monitoring:**
```
MonitorarEvento.ire:{
  "NomeFluxo": "Falha Iminente Equipamento",
  "CorrelacoesDetectadas": ["Temperatura > 450", "Vibração Alta"],
  "NivelCriticidade": "Crítico",
  "AcoesAutomatizadas": ["Iniciar Resfriamento", "Notificar Manutenção"]
}
```

**`.e` Flow:**
```
Fluxo: ProtocoloFalhaEquipamento
Inicio: DetectarRiscoFalha
Sequencia:
  - IniciarResfriamento
  - DesligarAlimentacao
  - NotificarEquipe
PoliticaVisita: PercorrerUnico
AcoesAoFinalizar:
  - RegistrarOcorrencia
  - AtualizarHistoricoEquipamento
```

<a id="security"></a>
### 8.3 Security Applications

In security applications, the IREAJE.NET ecosystem is adapted for:

**`.aje` Events:**
```
Re{RegistrarAcesso}.aje:{
  "Usuario": "ID_45872",
  "Recurso": "Servidor-DB-Prod",
  "TipoAcesso": "SSH",
  "Timestamp": "2025-04-26T02:23:15Z"
}

Re{TransferenciaArquivo}.aje:{
  "Origem": "Servidor-DB-Prod",
  "Destino": "IP_Externo",
  "Tamanho": "2.3GB",
  "Timestamp": "2025-04-26T02:25:30Z"
}
```

**`.ire` Monitoring:**
```
MonitorarEvento.ire:{
  "NomeFluxo": "Possível Exfiltração de Dados",
  "CorrelacoesDetectadas": ["Acesso fora de horário", "Transferência grande para IP externo"],
  "NivelCriticidade": "Muito Alto",
  "AcoesAutomatizadas": ["Bloquear transferências", "Alertar Segurança"]
}
```

**`.e` Flow:**
```
Fluxo: ProtocoloAmeacaInterna
Inicio: DetectarComportamentoAnomalo
Sequencia:
  - BloquearConexoes
  - RegistrarEvidencias
  - NotificarResponsaveis
PoliticaVisita: PercorrerUnico
AcoesAoFinalizar:
  - CriarCasoIncidente
  - IniciarInvestigacao
```

<a id="education"></a>
### 8.4 Educational Contexts

In educational applications, the IREAJE.NET ecosystem is adapted for:

**`.aje` Events:**
```
Re{RegistrarAtividade}.aje:{
  "Aluno": "ID_1045",
  "Atividade": "Quiz Matemática",
  "Pontuacao": 65,
  "Timestamp": "2025-04-26T10:15:00Z"
}

Re{RegistrarPresenca}.aje:{
  "Aluno": "ID_1045",
  "Aula": "Matemática Avançada",
  "Presenca": false,
  "Timestamp": "2025-04-26T09:00:00Z"
}
```

**`.ire` Monitoring:**
```
MonitorarEvento.ire:{
  "NomeFluxo": "Risco Acadêmico",
  "CorrelacoesDetectadas": ["Baixo desempenho", "Ausências frequentes"],
  "NivelCriticidade": "Médio",
  "AcoesAutomatizadas": ["Agendar tutoria", "Notificar responsáveis"]
}
```

**`.e` Flow:**
```
Fluxo: ProtocoloApoioAcademico
Inicio: IdentificarRiscoDesempenho
Sequencia:
  - AnalisarPadraoAprendizado
  - DefinirEstrategiaApoio
  - ImplementarTutoria
PoliticaVisita: PercorrerUnico
AcoesAoFinalizar:
  - AvaliarProgressoIntervencao
  - AtualizarPlanoEnsino
```

---

<a id="appendices"></a>
## 9. Appendices

<a id="grammar"></a>
### 9.1 Grammar Specifications

**`.aje` Grammar (EBNF):**
```
ajeDocument ::= 'Re{' eventType '}' '.aje:' jsonObject
eventType   ::= [A-Za-z][A-Za-z0-9]*
jsonObject  ::= '{' (property (',' property)*)? '}'
property    ::= string ':' value
```

**`.ire` Grammar (EBNF):**
```
ireDocument   ::= 'MonitorarEvento' '.ire:' jsonObject
jsonObject    ::= '{' (property (',' property)*)? '}'
property      ::= string ':' value
correlations  ::= '[' (string (',' string)*)? ']'
criticality   ::= '"' ('Baixo'|'Médio'|'Alto'|'Muito Alto') '"'
```

**`.e` Grammar (EBNF):**
```
eDocument     ::= 'Fluxo:' flowName eol
                  'Inicio:' startEvent eol
                  'Sequencia:' eol sequenceList
                  'PoliticaVisita:' policy eol
                  ('CondicoesInterrupcao:' eol conditionList)?
                  ('AcoesAoFinalizar:' eol actionList)?
flowName      ::= string
startEvent    ::= string
sequenceList  ::= (indent '-' string eol)+
policy        ::= 'PercorrerUnico' | 'PercorrerComRedundanciaControlada'
                | 'PercorrerParalelo' | 'PercorrerCondicional'
conditionList ::= (indent '-' string eol)+
actionList    ::= (indent '-' string eol)+
```

<a id="reference"></a>
### 9.2 Reference Implementations

Official reference implementations are available at:

- [GitHub - IREAJE/AjeParser](https://github.com/IREAJE/AjeParser) - C# implementation
- [GitHub - IREAJE/IreMonitor](https://github.com/IREAJE/IreMonitor) - F# implementation
- [GitHub - IREAJE/ERuntime](https://github.com/IREAJE/ERuntime) - F# implementation

> Note: These repositories will be made public as part of the Microsoft Founders Hub initiative.

<a id="conversion"></a>
### 9.3 Conversion Tools

Tools to convert between formats:

- `.aje` to Event Store – Converts `.aje` events to graph database format
- Event Log to `.aje` – Converts standard logs to `.aje` format
- Natural Language to `.aje` – Converts text descriptions to structured events
- `.e` to Visual Flow – Generates visual flow diagrams from `.e` definitions

---

© 2025 IREAJE | All Rights Reserved | Microsoft Founders Hub
