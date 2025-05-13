# Technical Manual: DSLs .aje, .ire, .e and IREAJE.NET Eulerian Runtime

## Introduction

The IREAJE.NET ecosystem presents a set of three domain-specific languages (DSLs) designed to handle different aspects of event processing, monitoring, and execution flow control. This system forms a comprehensive framework for building efficient, modular, and privacy-preserving systems.

This technical manual serves as the specification for:

- `.aje` - Actions & Journey Events language
- `.ire` - Intelligent Relational Events language
- `.e` - Eulerian Runtime language

## Ecosystem Overview

The IREAJE.NET follows a layered architecture where each language serves a specific purpose:

```
┌─────────────────────────────────────────┐
│ Input Sources (Text, Audio, etc.)       │
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
│ Output Actions (Alerts, APIs, etc.)     │
└─────────────────────────────────────────┘
```

### Core Principles

1. **Separation of Concerns**: Each language has a specific, focused purpose
2. **Data Flow Integrity**: Clean interfaces between layers
3. **Eulerian Efficiency**: Visit each node exactly once when possible
4. **Privacy by Design**: Operate on correlations, not identities
5. **Modularity**: Components can evolve independently

## .aje - Actions & Journey Events

### Core Concepts

`.aje` is the foundational language of the IREAJE.NET ecosystem, responsible for capturing and structuring events into a navigable graph. It serves as the perception layer, transforming inputs into structured events.

**Key Features:**
- Event representation as discrete, typed nodes
- Structured parameters with strong typing
- Support for relationships between events
- Immutability of recorded events
- Identity-optional design

### Syntax Specification

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
Re{RegisterSymptom}.aje:{
  "Symptom": "Chest pain",
  "Duration": "2 days",
  "Intensity": "Moderate",
  "Timestamp": "2025-04-26T10:15:30Z",
  "ContextId": "consultation-123"
}
```

### Event Types

`.aje` supports a flexible type system for events, with some core types:

| Event Category | Examples | Description |
|----------------|----------|-------------|
| Input Events | `RegisterEntry`, `CaptureData` | Initial data capture events |
| State Events | `ChangeState`, `SetStatus` | Record changes in state |
| Action Events | `ExecuteAction`, `SendNotification` | Record actions taken |
| Relation Events | `AssociateEntities`, `DefineRelation` | Establish connections |
| Lifecycle Events | `StartProcess`, `EndSession` | Track entity lifecycles |

Events can be extended for domain-specific needs while maintaining the core syntax.

### Implementation Guidelines

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

## .ire - Intelligent Relational Events

### Core Concepts

`.ire` operates as the monitoring and response layer of the IREAJE.NET ecosystem. It observes streams of `.aje` events, detects meaningful patterns or correlations, and triggers appropriate responses when conditions are met.

**Key Features:**
- Pattern recognition across multiple events
- Threshold-based alerting
- Temporal correlation detection
- Action emission based on detected patterns
- Privacy-preserving correlation without direct identities

### Syntax Specification

The `.ire` language follows this syntax pattern:

```
MonitorEvent.ire:{
  "FlowName": "FlowName",
  "DetectedCorrelations": ["Event1", "Event2", ...],
  "CriticalityLevel": "Level",
  "AutomatedActions": ["Action1", "Action2", ...],
  "ResponsePolicy": "ResponsePolicy",
  "Persistence": "PersistenceRule"
}
```

**Elements:**
- `MonitorEvent` - Standard monitor declaration
- `.ire:` - The language marker
- JSON object - Parameters defining monitoring behavior

**Example:**
```
MonitorEvent.ire:{
  "FlowName": "Acute Cardiovascular Risk",
  "DetectedCorrelations": ["Chest pain", "Hypertension", "Dyspnea"],
  "CriticalityLevel": "Very High",
  "AutomatedActions": ["Request urgent ECG", "Refer to emergency"],
  "ResponsePolicy": "Immediate Action",
  "Persistence": "Until clinical stabilization confirmed"
}
```

### Correlation Rules

`.ire` supports several types of correlation rules:

| Rule Type | Description | Example |
|-----------|-------------|---------|
| Co-occurrence | Events happening together | Symptoms appearing simultaneously |
| Sequence | Events in specific order | Login followed by unusual access pattern |
| Threshold | Quantitative limits | Temperature exceeding safety limits |
| Temporal | Time-based patterns | Recurring events at specific intervals |
| Complex | Combinations of other rules | Specific sequence with timing constraints |

Rules can be expressed using a combination of exact matches, regular expressions, and statistical thresholds.

### Implementation Guidelines

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

## .e - Eulerian Runtime Language

### Core Concepts

`.e` is the orchestration layer of the IREAJE.NET ecosystem, responsible for defining how execution flows through the system. It applies Eulerian principles—visiting each node exactly once when possible—to optimize performance and clarity.

**Key Features:**
- Declarative flow definition
- Single-pass execution paths
- Conditional branching and interruption
- Completion actions and cleanup
- Lightweight syntax for human readability

### Syntax Specification

The `.e` language follows this syntax pattern:

```
Flow: <flow_name>
Start: <initial_event>
Sequence:
  - <event_1>
  - <event_2>
  - <event_3>
VisitPolicy: <traversal_rule>
InterruptionConditions:
  - <condition_1>
  - <condition_2>
CompletionActions:
  - <action_1>
  - <action_2>
```

**Elements:**
- `Flow:` - Flow identifier
- `Start:` - Starting event
- `Sequence:` - Ordered list of events to process
- `VisitPolicy:` - Traversal policy (usually `SingleTraversal`)
- `InterruptionConditions:` - Conditions that halt execution
- `CompletionActions:` - Actions triggered on completion

**Example:**
```
Flow: CardiacDiagnosis
Start: RegisterSymptom
Sequence:
  - CheckHistory
  - WaitForExams
  - AnalyzeResults
  - IssueConclusion
VisitPolicy: SingleTraversal
InterruptionConditions:
  - InconclusiveExam
CompletionActions:
  - GenerateReport
  - NotifyPatient
```

### Execution Policies

`.e` supports several execution policies:

| Policy | Description | Use Case |
|--------|-------------|----------|
| `SingleTraversal` | Visit each node exactly once | Standard efficient execution |
| `ControlledRedundancyTraversal` | Allow limited revisits | When state verification is critical |
| `ParallelTraversal` | Execute independent branches in parallel | For performance on separate paths |
| `ConditionalTraversal` | Choose path based on runtime conditions | Decision-based processing |

### Implementation Guidelines

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

## Ecosystem Integration

### Data Flow Architecture

The IREAJE.NET ecosystem integrates the three languages into a coherent data flow:

```
[Input Sources] → [Parser] → Re{Events}.aje → [Event Store]
                                   ↓
[Pattern Rules] → [Monitor] → MonitorEvent.ire → [Alert System]
                                   ↓
[Flow Definitions] → [Runtime] → Flow.e → [Action Execution]
```

This architecture ensures that:
1. Data is captured and structured with `.aje`
2. Patterns are detected with `.ire`
3. Execution is optimized with `.e`

### Runtime Interaction

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

### Event Processing Pipeline

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

## Technical Implementation

### C# & F# Implementation

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

### Azure Infrastructure

The IREAJE.NET ecosystem is designed to leverage Azure services:

| Component | Azure Service | Purpose |
|-----------|---------------|---------|
| Event Storage | CosmosDB (Gremlin API) | Graph storage for `.aje` events |
| Event Processing | Azure Functions | Serverless execution of monitors |
| Event Bus | Event Grid | Message passing between components |
| Runtime State | Azure Redis Cache | Fast state tracking for `.e` runtime |
| API Layer | Azure API Management | Endpoint management |
| Monitoring | Application Insights | System health and performance |

### Performance Considerations

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

## The Eulerian Runtime

The concept of an Eulerian runtime is fundamental to the efficiency of the IREAJE.NET system. Based on mathematical principles of Eulerian graphs, this runtime ensures:

### Eulerian Runtime Characteristics

1. **Single Pass**: Each node is visited exactly once during execution
2. **Processing Efficiency**: Elimination of redundant operations
3. **History Clarity**: Each event has a unique documented path
4. **Resource Economy**: Ideal for distributed and resource-limited environments
5. **Auditability**: Clean and traceable trajectory of each flow

### Eulerian Runtime Architecture

```
[ Event Capture ]
        ↓
[ Parser → Re{Event}.aje ]
        ↓
[ State Validator ]
        ↓
[ Eulerian Flow Engine ]
        ↓
[ Correlation Monitoring (.ire) ]
        ↓
[ Actions and Alerts Emission ]
        ↓
[ Live Graph Update ]
```

### Key Runtime Components

- **Event Capture**: Receives inputs from various sources
- **Parser**: Converts inputs to structured .aje events
- **State Validator**: Checks relevant state changes
- **Eulerian Flow Engine**: Implements optimized traversal
- **Monitoring**: Detects patterns and events in real-time
- **Action Emitter**: Executes responses and alerts
- **Graph Updater**: Maintains updated system state

## Practical Applications

The IREAJE.NET ecosystem can be adapted for various domains:

### Healthcare

**`.aje` Example:**
```
Re{RegisterSymptom}.aje:{
  "Symptom": "Chest pain",
  "Duration": "2 days",
  "Intensity": "Moderate"
}
```

**`.ire` Example:**
```
MonitorEvent.ire:{
  "FlowName": "Acute Cardiovascular Risk",
  "DetectedCorrelations": ["Chest pain", "ST Change"],
  "CriticalityLevel": "Very High",
  "AutomatedActions": ["Request Troponin", "Alert Cardiologist"]
}
```

**`.e` Example:**
```
Flow: CoronarySyndromeProtocol
Start: IdentifyCardiovascularRisk
Sequence:
  - RequestCardiacMarkers
  - EvaluateResults
  - DefineManagement
VisitPolicy: SingleTraversal
InterruptionConditions:
  - NormalResults
CompletionActions:
  - DocumentProtocol
```

### Security

**`.aje` Example:**
```
Re{RegisterAccess}.aje:{
  "User": "ID_45872",
  "Resource": "Server-DB-Prod",
  "AccessType": "SSH",
  "Timestamp": "2025-04-26T02:23:15Z"
}
```

**`.ire` Example:**
```
MonitorEvent.ire:{
  "FlowName": "Possible Data Exfiltration",
  "DetectedCorrelations": ["After-hours access", "Large transfer to external IP"],
  "CriticalityLevel": "Very High",
  "AutomatedActions": ["Block transfers", "Alert Security"]
}
```

**`.e` Example:**
```
Flow: InsiderThreatProtocol
Start: DetectAnomalousActivity
Sequence:
  - BlockConnections
  - RecordEvidence
  - NotifyResponsibles
VisitPolicy: SingleTraversal
CompletionActions:
  - CreateIncidentCase
  - StartInvestigation
```

## System Benefits

1. **Maximum Efficiency**: Optimized processing without redundancies
2. **Privacy by Design**: Operation based on correlations, not identities
3. **Natural Scalability**: Growth by adding events and relationships
4. **Adaptive Flexibility**: Dynamic modification of flows in real-time
5. **Complete Auditability**: Clear history of all operations
6. **Domain Independence**: Applicable to various sectors (healthcare, security, industry)

## Conclusion

The IREAJE.NET ecosystem, with its languages `.aje`, `.ire`, and `.e`, represents an innovative approach to structuring, monitoring, and optimizing data flow and execution in complex systems. Its modular design, Eulerian efficiency, and privacy focus make it a powerful solution for various application domains.