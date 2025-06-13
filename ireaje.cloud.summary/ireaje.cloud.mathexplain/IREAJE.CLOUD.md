**Manual de Integração do Runtime Euleriano IREAJE.CLOUD no (qualquer frontend)**



**Visão Geral da Arquitetura**


O Web Client é uma aplicação web (ASP.NET Core/Blazor WebAssembly) que interage com um Runtime Euleriano IREAJE.CLOUD para orquestrar fluxos entre o front-end e serviços de cloud (Azure e OpenAI). A arquitetura integra três DSLs – .aje, .ire e .e – no backend como um middleware central (no MCP Core) responsável por conectar usuários e serviços de forma bidirecional. Em alto nível, os componentes são:

- Interface do Usuário (GoPilot Client): Aplicação ASP.NET Core ou Blazor WASM onde o usuário interage. Envia eventos e solicitações ao backend e exibe resultados ou notificações.
- Runtime Euleriano IREAJE.CLOUD (Middleware): Núcleo em .NET integrado ao servidor web, contendo parsers para as linguagens .aje, .ire e .e, e um orquestrador de execução (ExecutionRuntime). Recebe eventos do front-end, interpreta fluxos (.e) e invoca serviços conforme definido pelas linguagens DSL.
- Serviços Azure: Conjunto de serviços cloud conectados pelo runtime para executar tarefas de IA e persistência:

    - Azure OpenAI Service: Geração de texto, sumarização ou outras operações de LLM.
    - Azure Cognitive Services: Serviços de IA adicionais (visão computacional, fala, etc.) conforme necessário nos fluxos.
    - Azure Cosmos DB (Gremlin API): Armazenamento de eventos .aje em forma de grafo.
    - Azure AI Search (Cognitive Search): Indexação e busca vetorial de informações (ex. memória vetorial para contexto).
    - Azure Functions: Execução de monitores e automações definidas em .ire (eventos inteligentes), operando de forma serverless para lidar com detecções de padrão em segundo plano.
    - Azure Redis Cache: Cache de estado do runtime (opcional, para performance em fluxos .e complexos).
- 
- Autenticação e Segurança: Integração com Microsoft Entra ID (Azure AD) para autenticar usuários no front-end e proteger a API backend via JWT. Garante que somente usuários autorizados disparem fluxos.


Fluxo Básico: O usuário realiza uma ação no front-end (por exemplo, envia uma solicitação ou carrega um documento). Essa ação é capturada como um evento .aje e enviada ao backend. O runtime IREAJE.CLOUD registra esse evento (por exemplo, no Cosmos DB) e verifica se há monitores .ire relevantes (que detectam padrões ou correlações de eventos). Em seguida, aciona um fluxo .e (previamente definido ou dinâmico) correspondente à ação. O orquestrador .e então executa passo a passo as operações definidas (chamando serviços Azure, funções ou lógica interna) e retorna os resultados ao front-end, possivelmente gerando novos eventos ou notificações de saída. Todo o processo ocorre em tempo real, com baixa latência, graças à execução em memória pelo ExecutionRuntime integrado.


**Passo 1: Configurar Autenticação (Microsoft Entra ID)**


Como primeira etapa, configure a autenticação via Azure AD para assegurar um canal seguro entre o cliente e o backend:

1. Registrar Aplicativos no Entra ID: No portal do Azure, registre dois App Registrations – um para o Client (SPA Blazor ou ASP.NET) e outro para a API (ASP.NET Core). Ambos devem estar no mesmo diretório (tenant) single-tenant:

    - App do Backend (API): Configure um URI de ID de Aplicativo (App ID URI) ou Scope para identificar a API. Exemplo: api://<seu-domínio>/gopilot. Gere também um Client ID para uso nas configurações.
    - App do Frontend (Client): Configure como aplicação SPA (se Blazor WASM) ou Web (se ASP.NET server-side). Adicione o Redirect URI apropriado (por ex., https://localhost:5001/authentication/login-callback para Blazor WASM). Conceda permissão de acesso à API registrada acima (delegated permission), adicionando o scope gopilot e consentindo.
2. 
3. Atribuir Papéis ou Grupos (opcional): Se necessário, defina papéis de aplicativo ou use grupos do Azure AD para autorização granular no backend.
4. Configurar o Blazor/Web Client: Use a biblioteca Microsoft Authentication Library (MSAL) ou Microsoft.Identity.Web nas configurações do projeto:

    - Para Blazor WASM, instale o pacote Microsoft.Authentication.WebAssembly.Msal. No Program.cs do projeto cliente, chame builder.Services.AddMsalAuthentication(options => { ... }) fornecendo as configurações do Client ID, Tenant ID e Scope de acesso à API.
    - Exemplo (Blazor WASM Program.cs):
5. 

builder.Services.AddMsalAuthentication(options =>

{

    options.ProviderOptions.Authentication.Authority = 

        "https://login.microsoftonline.com/{SeuTenantID}";

    options.ProviderOptions.Authentication.ClientId = "{ClientID\_do\_Frontend}";

    options.ProviderOptions.DefaultAccessTokenScopes.Add(

        "{AppID\_URI\_da\_API}/gopilot"); // escopo da API

});

3. 
    - 

    - Isso garante que o front-end obtenha um token JWT para chamar a API protegida.
    - 
4. Configurar o ASP.NET Core Backend: Use Microsoft.Identity.Web para proteger a API com JWT do Entra ID:

    - No arquivo appsettings.json do projeto servidor, adicione uma seção AzureAd com as configurações:
5. 

"AzureAd": {

  "Instance": "https://login.microsoftonline.com/",

  "Domain": "<seu-domínio>.onmicrosoft.com",

  "TenantId": "<SeuTenantID>",

  "ClientId": "<ClientID\_do\_Backend>",

  "Audience": "<AppID\_URI\_da\_API>" 

}

4. 
    - 

    - No Program.cs (ou Startup.cs em versões anteriores), habilite a autenticação JWT:
    - 

var builder = WebApplication.CreateBuilder(args);

// ... outras configurações

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthorization();

4. 
    - Isso configura o middleware para validar tokens JWT enviados pelo front-end . A API deve exigir autenticação nos controladores/endereços relevantes (por exemplo, usando [Authorize] em controladores ou endpoints).
    - 
5. Testar Login: Execute a aplicação localmente. Ao acessar o cliente, você deve ser redirecionado para login do Azure AD e, após autenticação, conseguir chamar a API (verifique que chamadas AJAX ou Fetch do client enviam o token Bearer no header Authorization). Assegure que chamadas não autenticadas à API sejam bloqueadas.



**Passo 2: Provisionar Recursos Azure Necessários**


Com a autenticação configurada, prepare os serviços Azure que serão orquestrados pelo runtime:

- Azure OpenAI Service: Crie um recurso Azure OpenAI em seu subscription (requere aprovação prévia da Microsoft). Dentro dele, implante o modelo desejado (por exemplo, gpt-4, gpt-35-turbo etc.) e anote o endpoint e nome do deployment do modelo. Exemplo de endpoint: https://<seu-recurso>.openai.azure.com/. Configure também as credenciais de acesso:

    - Managed Identity (Recomendado): Como usaremos o Azure no backend, podemos optar por usar identidade gerenciada do Azure para acessar o OpenAI, evitando chaves de API. Basta garantir que a identidade atribuída ao aplicativo backend tenha a permissão Cognitive Services OpenAI User no recurso OpenAI. Em código, utilizaremos DefaultAzureCredential para autenticar.
    - Chave de API (Alternativo): Obtenha a chave API Key do recurso OpenAI e a URL. Em código, pode-se usar new AzureOpenAIClient(new Uri(endpoint), new AzureKeyCredential("KEY")) se não usar Managed Identity.
- 
- Azure Cognitive Services: Opcionalmente, habilite serviços necessários para seu caso de uso:

    - Exemplo: Serviço de Form Recognizer para OCR de documentos, Serv. de Tradução, Text Analytics, etc. Cada um exigirá sua chave/endpoint ou uso via SDK + credencial padrão. Anote as informações conforme precisará usá-las nos fluxos.
- 
- Azure Cosmos DB (API Gremlin): Crie uma conta Cosmos DB com API Gremlin (que fornece armazenamento orientado a grafo). Dentro dela, crie um Database e um Graph (coleção) para armazenar eventos .aje. Essa estrutura permitirá salvar eventos e suas relações, possibilitando consultas de correlação. Exemplo:

    - Database: IREAJE\_DB
    - Graph (Container): EventosGraph (com throughput configurado conforme necessidade).
Anote a Connection String do Cosmos DB (se for usar chave) ou configure identidade gerenciada para acesso.
- 
- Azure AI Search (Cognitive Search): Crie um serviço de Cognitive Search (versão que suporta Vector Search se planeja armazenar embeddings). No primeiro momento, você pode definir um índice para armazenar vetores ou documentos para busca semântica, caso fluxos .e envolvam busca contextual. Por exemplo, um índice documentos-index com campos de texto e um campo vetorial para embeddings. Configure uma Chave Admin ou use credencial gerenciada.
- Azure Functions: Configure um Function App (em .NET) no Azure para rodar monitores .ire e outras automações serverless. A ideia é ter funções que possam reagir a eventos novos ou temporizadores:

    - Exemplo de Função Trigger: Uma Azure Function com Cosmos DB Trigger associada ao container de eventos .aje. Sempre que um novo evento é inserido, a função é acionada e carrega os monitores .ire configurados para verificar se o padrão de correlação é atendido; se sim, ela pode acionar ações automatizadas (como registro de log, notificações, ou mesmo iniciar um fluxo .e correspondente via chamada à API).
    - Exemplo de Função Timer: Uma função que roda periodicamente para verificar condições ou expirar fluxos persistentes (conforme Persistencia definida em monitores .ire).
    - Importante: Os parsers .ire serão integrados no core; a Azure Function pode reutilizar o mesmo código (por exemplo, compartilhando uma biblioteca) para interpretar os arquivos .ire e executar lógica de correlação.
- 
- Outros Serviços: Considere provisionar também:

    - Azure Redis Cache: opcional, para armazenar estados do runtime .e (variáveis de fluxo, checkpoints) em cenários escaláveis ou de longa duração.
    - Azure Application Insights: para telemetria da aplicação (métricas, logs de desempenho e falhas).
- 


Após provisionar, reúna as configurações (IDs, endpoints, nomes) e armazene-as em variáveis de ambiente ou no appsettings.json do backend:

"AzureSettings": {

  "OpenAI": {

    "Endpoint": "https://<seu-recurso>.openai.azure.com/",

    "ModelDeployment": "gpt-35-turbo",

    "UseManagedIdentity": true

  },

  "Cosmos": {

    "Endpoint": "https://<seu-cosmos>.documents.azure.com:443/",

    "Database": "IREAJE\_DB",

    "Container": "EventosGraph"

  },

  "CognitiveSearch": {

    "Endpoint": "https://<seu-search>.search.windows.net/",

    "IndexName": "documentos-index"

  }

}

(Se usar identidade gerenciada, não coloque chaves no config; se não, inclua "ApiKey" conforme necessário.)


**Passo 3: Estrutura do Projeto e Organização de Pastas**


Estruture o código fonte de forma clara para acomodar o cliente, servidor e os artefatos (.aje, .ire, .e). Abaixo um exemplo de estrutura de solução para um projeto GoPilot hospedando um Blazor WebAssembly e ASP.NET Core API:

GoPilotSolution/

├── GoPilot.Client/         # Projeto Blazor WebAssembly (frontend)

│   ├── Pages/             # Páginas Blazor (UI)

│   ├── Services/          # Serviços front-end (ex: chamadas API via HttpClient)

│   └── Program.cs         # Configurações MSAL, HttpClient, etc.

├── GoPilot.Server/         # Projeto ASP.NET Core (backend)

│   ├── Controllers/       # API Controllers (endpoints para executar fluxos, etc.)

│   ├── Services/          # Serviços de domínio e integração (ex: Orquestrador, Azure clients)

│   ├── Parsers/           # Classes para parsing de arquivos .aje, .ire, .e 

│   ├── Flows/             # Pasta com arquivos de fluxo .e e monitores .ire (opcionalmente .aje de exemplo)

│   ├── Models/            # Classes de modelo (ex: classes EventoAje, MonitorIre, FluxoE)

│   ├── Program.cs         # Configuração do app (DI, Auth, etc.)

│   └── appsettings.json   # Configurações (Azure AD, Azure services)

└── GoPilot.Shared/         # Projeto compartilhado (se necessário, p.ex. contratos de dados)

Detalhes:

- O projeto GoPilot.Client contém a UI e deve ter referência para obter tokens e chamar a API. Configure nele o HttpClient padrão apontando para a URL do backend (ex.: builder.Services.AddHttpClient("ServerAPI", client => client.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)); para chamadas relativas).
- O projeto GoPilot.Server contém toda a lógica do runtime e integrações. Armazene os arquivos de fluxo .e e monitores .ire na pasta Flows/ ou embuta-os como resources no assembly, conforme sua preferência. O ideal é facilitar atualização desses fluxos sem recompilar a aplicação – por exemplo, carregando de um armazenamento (pasta ou Azure Blob) configurável.
- Em Parsers/ coloque as implementações que parseiam strings/arquivos dessas DSLs em objetos (ou estruturas de dados) que o programa .NET manipulará.
- Em Services/ coloque serviços como:

    - ExecutionRuntimeOrchestrator: responsável por orquestrar fluxos .e.
    - EventLoggerService: responsável por registrar eventos .aje (p. ex., salvando no Cosmos DB).
    - PatternMonitorService: opcional, para verificar monitores .ire (se não for exclusivamente via Azure Functions).
    - AzureClientsService ou configurações separadas: instanciar clientes do Azure OpenAI, Cosmos, Search etc. (podem ser registrados via DI diretamente no Program.cs usando SDKs).
- 



**Passo 4: Implementar Parsers para .aje, .ire e .e**


O primeiro componente de código do runtime é a capacidade de interpretar os arquivos/strings das linguagens de domínio e convertê-los em estruturas manipuláveis. Abaixo, implementamos cada parser separadamente:


**4.1 Parser** 

**.aje**

 **(Actions & Journey Events)**


Os eventos .aje são definidos em formato JSON com uma sintaxe consistente. Exemplo de evento .aje no domínio de saúde:

Re{RegisterSymptom}.aje:{

  "Symptom": "Chest pain",

  "Duration": "2 days",

  "Intensity": "Moderate",

  "Timestamp": "2025-04-26T10:15:30Z",

  "ContextId": "consultation-123"

}

Cada evento tem um tipo (ex: RegisterSymptom) e um conjunto de parâmetros em JSON. Podemos modelar isso em C#:

public class EventoAje

{

    public string Tipo { get; set; }        // e.g., "RegisterSymptom"

    public Dictionary<string, object> Parametros { get; set; }

    public DateTime Timestamp { get; set; }

    public string ContextId { get; set; }

}

O parser .aje basicamente extrai o tipo do evento e os parâmetros:

- Identifique o padrão Re{Tipo}.aje: no início da string.
- Parseie o conteúdo JSON subsequente.


Usando System.Text.Json ou Newtonsoft:

public EventoAje ParseAjeEvent(string ajeString)

{

    // Ex: "Re{TipoEvento}.aje:{ ... }"

    var match = Regex.Match(ajeString, @"Re\\{(.+)\\}\\.aje:\\s\*(\\{.\*\\})");

    if(!match.Success) throw new FormatException("Formato .aje inválido.");

    string tipo = match.Groups[1].Value;

    string json = match.Groups[2].Value;

    var parametros = JsonSerializer.Deserialize<Dictionary<string, object>>(json);

    // Extrai timestamp se existir nos parâmetros

    parametros.TryGetValue("Timestamp", out object tsObj);

    DateTime timestamp = tsObj != null ? DateTime.Parse(tsObj.ToString()) : DateTime.UtcNow;

    parametros.Remove("Timestamp");

    // Extrai ContextId se existir

    parametros.TryGetValue("ContextId", out object ctxObj);

    string contextId = ctxObj?.ToString();

    parametros.Remove("ContextId");

    return new EventoAje { Tipo = tipo, Parametros = parametros, Timestamp = timestamp, ContextId = contextId };

}

Uso: Ao receber um evento do front-end (por exemplo, via controller API), chame ParseAjeEvent(conteudo) para obter o objeto EventoAje. Em seguida, registre esse evento (ex.: salvando no Cosmos DB) e passe-o adiante ao orquestrador de fluxos se necessário.


**4.2 Parser** 

**.ire**

 **(Intelligent Relational Events)**


Monitores .ire definem correlações de eventos e respostas automáticas. O formato também é JSON, conforme modelo:

MonitorarEvento.ire:{

  "NomeFluxo": "MonitoramentoSistemasWeb",

  "CorrelacoesDetectadas": ["ErroAutenticacao", "TentativaAcessoRepetida", "AlteracaoPermissoes"],

  "NivelCriticidade": "Alto",

  "AcoesAutomatizadas": ["RegistrarLogSeguranca", "NotificarAdministrador", "BloquearIP"],

  "PoliticaDeResposta": "BloqueioTemporario",

  "Persistencia": "7Dias",

  "Parametros": { "LimiarTentativas": 5, "TempoObservacao": "5min" },

  "CondicoesAdicao": { "OrigemIP": "filtrarPorPadrao", "HorarioAcesso": "foraExpediente" },

  "MetadadosCorrelacao": { "TipoAnalise": "padrao", "AlgoritmoDeteccao": "sequenciaTemporalProxima", "ConfiancaCorrelacao": 0.85 },

  "Timestamp": "2025-04-27T14:32:15.245Z",

  "Versao": "1.0.3"

}

Estruture uma classe MonitorIre com campos correspondentes (NomeFluxo, lista de correlações, etc.). Por exemplo:

public class MonitorIre

{

    public string NomeFluxo { get; set; }

    public List<string> CorrelacoesDetectadas { get; set; }

    public string NivelCriticidade { get; set; }

    public List<string> AcoesAutomatizadas { get; set; }

    public string PoliticaDeResposta { get; set; }

    public string Persistencia { get; set; }

    public Dictionary<string, object> Parametros { get; set; }

    public Dictionary<string, string> CondicoesAdicao { get; set; }

    public Dictionary<string, object> MetadadosCorrelacao { get; set; }

    public DateTime Timestamp { get; set; }

    public string Versao { get; set; }

}

O parser irá deserializar o JSON após a marcação .ire: similar ao .aje:

public MonitorIre ParseIreMonitor(string ireString)

{

    var match = Regex.Match(ireString, @"\\.ire:\\s\*(\\{.\*\\})");

    if(!match.Success) throw new FormatException("Formato .ire inválido.");

    string json = match.Groups[1].Value;

    var monitor = JsonSerializer.Deserialize<MonitorIre>(json);

    return monitor;

}

Após parsear, esses objetos podem ser armazenados (talvez em Cosmos DB ou carregados na inicialização do app a partir de arquivos). O sistema de monitoramento pode então, a cada novo evento .aje, verificar se uma combinação de eventos corresponde a CorrelacoesDetectadas definidas:

- Isso envolve manter histórico recente de eventos (ex.: consulta no grafo do Cosmos DB por eventos do mesmo ContextId ou usuário).
- Se um padrão for encontrado (ex: em curto intervalo ocorreram “ErroAutenticacao” seguido de “TentativaAcessoRepetida”), o monitor .ire define ações:

    - Ações Automatizadas: podem ser invocadas imediatamente (ex: chamar um método AcaoRegistrarLogSeguranca() ou colocar uma mensagem em fila).
    - Política de Resposta: guiará o comportamento (ex: “BloqueioTemporario” pode significar que o sistema deve bloquear o IP por X minutos).
- 
- Implementação: No PatternMonitorService (ou dentro da Azure Function trigger do Cosmos), carregue monitores ativos e compare com o evento atual e contexto para decidir se ativa. Esse mecanismo pode ser complexo; para simplificar, opte inicialmente por monitores simples (2-3 eventos) e use consultas no Cosmos DB (Gremlin) para verificar ocorrências correlatas.



**4.3 Parser** 

**.e**

 **(Eulerian Runtime Language)**


O arquivo .e define fluxos de execução (orquestração) e pode ser escrito em YAML ou JSON. O exemplo fornecido de .e:

Fluxo: ProcessamentoDocumentoInteligente

Inicio: ReceberDocumento

Sequencia:

  - AnalisarMetadados

  - ExtrairConteudo

  - ClassificarDocumento

  - EnriquecerComContexto

  - GerarSumarizacao

  - ArmazenarEmMemoriaVetorial

  - NotificarUsuario

PoliticaVisita: PercorrerUnico

CondicoesInterrupcao:

  - FormatoInvalido

  - TamanhoExcedido

  - ConteudoRestrito

  - ErroAnalise

AcoesAoFinalizar:

  - RegistrarLogProcessamento

  - AtualizarEstatisticas

  - GerarRelatorioExecucao

Para parsear YAML em .NET, utilize uma biblioteca como YamlDotNet (via NuGet). Crie uma classe FluxoE que corresponda aos campos:

public class FluxoE

{

    public string Fluxo { get; set; }                // Nome do fluxo

    public string Inicio { get; set; }               // Evento inicial que dispara o fluxo

    public List<string> Sequencia { get; set; }      // Passos em ordem

    public string PoliticaVisita { get; set; }       // e.g. "PercorrerUnico"

    public List<string> CondicoesInterrupcao { get; set; }

    public List<string> AcoesAoFinalizar { get; set; }

}

Parser YAML:

public FluxoE ParseFluxoE(string eContent)

{

    var deserializer = new DeserializerBuilder().Build();

    try

    {

        var fluxo = deserializer.Deserialize<FluxoE>(eContent);

        return fluxo;

    }

    catch(Exception ex)

    {

        throw new Exception($"Erro ao parsear fluxo .e: {ex.Message}", ex);

    }

}

(Não esqueça de adicionar YamlDotNet via dotnet add package YamlDotNet e using YamlDotNet.Serialization;.)

Se preferir JSON, os fluxos .e podem ser expressos como JSON também e parseados via JSON deserializer. Porém, YAML é legível e adequado para definir sequências.

Carregue todos os fluxos .e disponíveis no startup da aplicação:

- Por exemplo, leia todos os arquivos .e da pasta Flows/, parseie e armazene em um dicionário fluxosPorNome[fluxo.Nome] = fluxo.
- Alternativamente, armazene fluxos no Cosmos DB ou em outro repositório, mas localmente em arquivo é simples no início.



**Passo 5: Implementar o Orquestrador de Execução Euleriano (.e)**


Com os fluxos .e parseados em objetos FluxoE, precisamos de um orquestrador que execute esses passos respeitando a política Euleriana (visitar cada nó uma vez, etc.). Vamos construir um serviço central, por exemplo ExecutionRuntimeOrchestrator, com responsabilidade de executar fluxos sob demanda.

5.1 Mapeamento de Operações (Handlers): Cada passo definido em Sequencia de um fluxo corresponde a uma operação que deve ser implementada em código. Podemos usar uma abordagem de handlers registrados em um dicionário, mapeando o nome da operação a uma função. Isso facilita adicionar novas ações sem modificar um switch fixo.

Exemplo de registro de handlers:

public class ExecutionRuntimeOrchestrator

{

    private readonly Dictionary<string, Func<ExecutionContext, Task>> \_handlers;

    private readonly AzureServicesFacade \_azure; // objeto que contém clientes Azure (OpenAI, Search, etc.)

    public ExecutionRuntimeOrchestrator(AzureServicesFacade azureServices)

    {

        \_azure = azureServices;

        \_handlers = new Dictionary<string, Func<ExecutionContext, Task>>

        {

            { "AnalisarMetadados", ctx => AnalisarMetadados(ctx) },

            { "ExtrairConteudo", ctx => ExtrairConteudoAsync(ctx) },

            { "ClassificarDocumento", ctx => ClassificarDocumentoAsync(ctx) },

            { "EnriquecerComContexto", ctx => EnriquecerComContextoAsync(ctx) },

            { "GerarSumarizacao", ctx => GerarSumarizacaoAsync(ctx) },

            { "ArmazenarEmMemoriaVetorial", ctx => ArmazenarVetorialAsync(ctx) },

            { "NotificarUsuario", ctx => NotificarUsuarioAsync(ctx) }

            // ... também registrar handlers para AcoesAoFinalizar e possivelmente condicoes de interrupcao

        };

    }

    public async Task<bool> ExecutarFluxoAsync(FluxoE fluxo, ExecutionContext contexto)

    {

        foreach (string passo in fluxo.Sequencia)

        {

            // Verifica se deve interromper antes do passo (ex: condições prévias no contexto)

            if(contexto.ShouldInterrupt(fluxo.CondicoesInterrupcao))

                break;

            if(\_handlers.TryGetValue(passo, out var operacao))

            {

                await operacao(contexto);

            }

            else

            {

                throw new InvalidOperationException($"Operação '{passo}' não implementada.");

            }

        }

        // Após sequência, executar ações de finalização

        foreach(string acaoFinal in fluxo.AcoesAoFinalizar ?? Enumerable.Empty<string>())

        {

            if(\_handlers.TryGetValue(acaoFinal, out var operacaoFinal))

                await operacaoFinal(contexto);

        }

        return true;

    }

    // Exemplo de handler (metadados pode ser síncrono):

    private Task AnalisarMetadados(ExecutionContext ctx)

    {

        var doc = ctx.Get<Document>("Documento");

        ctx.Set("Metadados", doc.ObterMetadados()); 

        return Task.CompletedTask;

    }

    // Exemplo de handler assíncrono (sumarização via OpenAI):

    private async Task GerarSumarizacaoAsync(ExecutionContext ctx)

    {

        var texto = ctx.Get<string>("TextoExtraido");

        string prompt = $"Resuma o seguinte documento:\\n{texto}";

        string resumo = await \_azure.OpenAIClient.GetCompletionAsync(prompt);

        ctx.Set("Resumo", resumo);

    }

    // ... demais handlers similarmente

}

Sobre ExecutionContext: é uma classe auxiliar para compartilhar dados entre passos do fluxo, como um dicionário de contexto. Por exemplo, quando ExtrairConteudo obtém o texto de um documento, ele armazenaria ctx.Set("TextoExtraido", texto), para que GerarSumarizacao possa recuperar com ctx.Get<string>("TextoExtraido").

Política de Visita: No exemplo, PoliticaVisita é PercorrerUnico, então simplesmente iteramos na ordem listada (garantindo visita única). Se fosse PercorrerParalelo ou outra, o orquestrador teria que tratar de maneira diferente, por ex:

- PercorrerParalelo: passos podem ser executados simultaneamente (talvez usar Task.WhenAll em blocos designados como paralelos).
- Condicional: o fluxo .e pode especificar ramificações condicionais; o orquestrador deve avaliar condições e escolher o ramo certo.


Para começar, implemente apenas a execução linear simples. Assim que isso funcionar, adicione suporte a padrões mais complexos conforme necessário.

Condições de Interrupção: Durante a execução, se alguma condição for alcançada, o fluxo deve interromper antes de completar todos os passos:

- Por exemplo, condicao “TamanhoExcedido” poderia ser checada após ExtrairConteudo, se um doc for muito grande. O ExecutionContext.ShouldInterrupt(List<string> condicoes) pode conter lógica para ver bandeiras no contexto (ex: ctx.Set("ErroAnalise", true) setado em algum passo, etc.).
- Se interromper, ainda assim deve executar AcoesAoFinalizar para limpeza ou log.


Ações ao Finalizar: Estes passos (como “RegistrarLogProcessamento”, “AtualizarEstatisticas”, etc.) geralmente são pós-execução e independem de sucesso ou falha. Implemente-os como handlers também (podem simplesmente registrar informações no Cosmos ou Application Insights, por exemplo).

Com o orquestrador implementado, você tem um método ExecutarFluxoAsync(FluxoE, contexto) que pode ser chamado a qualquer momento para rodar um fluxo completo.


**Passo 6: Integração do Runtime no ASP.NET Core (Middleware e Serviços)**


Agora vamos conectar o orquestrador e parsers ao ciclo da aplicação ASP.NET Core, de forma que tudo funcione em conjunto:


**6.1 Registro de Dependências (Dependency Injection)**


No Program.cs do projeto GoPilot.Server, registre os serviços criados:

var builder = WebApplication.CreateBuilder(args);

// ... outras configurações como AddAuthentication/AzureAd feitas anteriormente

// Registrando serviços do runtime

builder.Services.AddSingleton<AzureServicesFacade>(); // classe para gerenciar clientes Azure

builder.Services.AddSingleton<ExecutionRuntimeOrchestrator>();

builder.Services.AddSingleton<EventLoggerService>();

builder.Services.AddSingleton<PatternMonitorService>();  // se aplicável

// Pode usar AddSingleton pois queremos manter estado (ex: cache de fluxos carregados) durante todo o app

var app = builder.Build();

app.UseAuthentication();

app.UseAuthorization();

// Mapear endpoints

app.MapControllers();

app.Run();

AzureServicesFacade é uma classe (que você deve criar) para encapsular instâncias de clientes do Azure (OpenAI, Search, etc.) e talvez chaves de configuração. Por exemplo, no construtor dela você pode criar:

public class AzureServicesFacade {

   public Azure.OpenAI.AzureOpenAIClient OpenAIClient { get; }

   public SearchClient SearchClient { get; }

   public CosmosClient CosmosClient { get; }

   // ... outros clientes

   public AzureServicesFacade(IConfiguration config, TokenCredential credential) {

       // Use Azure SDKs para instanciar

       var openAIEndpoint = new Uri(config["AzureSettings:OpenAI:Endpoint"]);

       if (bool.Parse(config["AzureSettings:OpenAI:UseManagedIdentity"] ?? "false"))

           OpenAIClient = new AzureOpenAIClient(openAIEndpoint, credential);

       else {

           string apiKey = config["AzureSettings:OpenAI:ApiKey"];

           OpenAIClient = new AzureOpenAIClient(openAIEndpoint, new AzureKeyCredential(apiKey));

       }

       // SearchClient from Azure.Search.Documents

       var searchEP = config["AzureSettings:CognitiveSearch:Endpoint"];

       var searchKey = config["AzureSettings:CognitiveSearch:ApiKey"];

       SearchClient = new SearchClient(new Uri(searchEP), config["AzureSettings:CognitiveSearch:IndexName"], new AzureKeyCredential(searchKey));

       // CosmosClient

       CosmosClient = new CosmosClient(config["AzureSettings:Cosmos:Endpoint"], config["AzureSettings:Cosmos:Key"]);

       // etc.

   }

}

Aqui, TokenCredential credential pode ser resolvido via DI usando DefaultAzureCredential do pacote Azure.Identity (registre builder.Services.AddSingleton<TokenCredential, DefaultAzureCredential>(); se for usar MI).


**6.2 Middleware ou Controller de Execução**


Existem duas abordagens para acionar o runtime pelo front-end: via Controller API tradicional ou via SignalR (tempo real). Inicialmente, usamos um controller simples:

Crie um controlador RuntimeController (ASP.NET Core API):

[ApiController]

[Route("api/[controller]")]

[Authorize]  // requer JWT válido

public class RuntimeController : ControllerBase

{

    private readonly ExecutionRuntimeOrchestrator \_orchestrator;

    private readonly EventLoggerService \_eventLogger;

    private readonly Dictionary<string, FluxoE> \_fluxos;  // suponha que carregamos isso no EventLogger ou Orchestrator

    public RuntimeController(ExecutionRuntimeOrchestrator orch, EventLoggerService evtLog)

    {

        \_orchestrator = orch;

        \_eventLogger = evtLog;

        \_fluxos = evtLog.FluxosDefinidos; // por ex., EventLogger carrega fluxos .e na inicialização

    }

    [HttpPost("executar")]

    public async Task<IActionResult> ExecutarFluxo([FromBody] string eventoAje)

    {

        // 1. Parser do evento .aje recebido

        EventoAje evento = ParserAje.ParseAjeEvent(eventoAje);

        // 2. Registrar evento no grafo (Cosmos DB)

        await \_eventLogger.RegistrarEventoAsync(evento);

        // 3. Verificar se evento inicializa algum fluxo .e

        string tipoEvento = evento.Tipo;

        // Encontrar fluxo cujo Inicio corresponda a esse tipo de evento

        var fluxo = \_fluxos.Values.FirstOrDefault(f => f.Inicio == tipoEvento);

        if (fluxo == null)

            return NotFound($"Nenhum fluxo configurado para iniciar com evento {tipoEvento}.");

        // 4. Preparar contexto de execução com dados do evento

        var contexto = new ExecutionContext();

        contexto.Set("EventoInicial", evento);

        // Se o evento possui dados úteis (ex documento, texto), adicioná-los no contexto

        foreach(var param in evento.Parametros)

            contexto.Set(param.Key, param.Value);

        // 5. Executar orquestrador

        bool sucesso = await \_orchestrator.ExecutarFluxoAsync(fluxo, contexto);

        // 6. Retornar resultado apropriado 

        // (pode ser dados do contexto final ou apenas status)

        if(sucesso)

        {

            // Exemplo: retornar o resumo gerado se existir

            if(contexto.Exists("Resumo"))

                return Ok(contexto.Get<string>("Resumo"));

            else

                return Ok("Fluxo executado com sucesso.");

        }

        else

        {

            return StatusCode(500, "Fluxo interrompido ou falhou.");

        }

    }

}

Explicação:

- Endpoint POST /api/runtime/executar: Recebe um evento .aje (por simplicidade, enviado como string JSON pelo front-end). O front-end poderia enviar diretamente já no formato .aje ou poderíamos definir um DTO.
- O controller autentica via [Authorize] (o token do front-end deve ser válido).
- Em sequência:

    1. Faz o parse do evento .aje.
    2. Registra o evento usando EventLoggerService (que internamente insere no Cosmos DB grafo). Isso torna o evento persistente e disponível para consultas de monitores .ire ou auditoria.
    3. Verifica se esse evento inicial deve disparar um fluxo .e. Aqui assumimos que temos todos fluxos carregados e procuramos aquele cujo campo Inicio coincide com evento.Tipo. (Alternativamente, poderíamos permitir que o front-end especifique qual fluxo executar, mas seguir a definição automatizada é menos propenso a erro).
    4. Prepara um ExecutionContext e injeta dados relevantes (parâmetros do evento inicial).
    5. Chama o orquestrador para executar o fluxo encontrado.
    6. Retorna o resultado. Isso pode variar – no caso de fluxos que produzem um resultado imediato (ex: resumo de documento, resposta de chat), retornamos esses dados. Em fluxos que apenas disparam ações (ex: envio de notificação), podemos retornar um status ou mensagem de sucesso.
- 


Nota: Para interação mais bidirecional (como atualização em tempo real de passos do fluxo), poderia-se usar SignalR hubs para enviar eventos do backend ao cliente (por ex., notificar progresso, ou enviar o resultado da etapa “NotificarUsuario”). Em uma primeira versão, você pode simplificar retornando somente quando o fluxo conclui, e em iterações futuras adicionar SignalR se necessário para streaming de respostas ou notificações proativas.


**6.3 Segurança e Permissões**


Garanta que:

- Somente usuários autenticados acessem o endpoint de execução.
- Opcional: Autorização baseada em papel para certos fluxos (ex: apenas admins podem disparar certos fluxos críticos).
- As credenciais de acesso aos serviços Azure (OpenAI, Cosmos etc.) não estejam expostas no cliente; todas as chamadas sensíveis ocorrem no servidor.


No cliente Blazor, ao chamar a API, utilize o token obtido via MSAL:

// Exemplo de chamada no front-end usando HttpClient injetado

var eventoJson = "{\\"Symptom\\":\\"...\\"}"; // construção do evento .aje ou pode montar a estrutura Re{Tipo}.aje:{...}

var result = await HttpClient.PostAsync("api/runtime/executar", new StringContent(eventoJson, Encoding.UTF8, "application/json"));

if(result.IsSuccessStatusCode)

{

    var responseText = await result.Content.ReadAsStringAsync();

    // exibir resultado para usuário

}

(Em Blazor WASM, se configurado, o HttpClient “ServerAPI” já adiciona token automaticamente. Caso contrário, use HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);.)


**Passo 7: Integração com Serviços Azure nos Handlers do Fluxo**


Já registramos instâncias de clientes Azure no AzureServicesFacade. Agora detalhamos como cada operação do fluxo .e pode usar esses serviços:

- Azure OpenAI (GerarSumarizacao, Chat etc.): Usando o cliente Azure OpenAI:

// Supondo AzureServicesFacade.OpenAIClient configurado 

public async Task<string> GetCompletionAsync(string prompt)

{

    var chatClient = OpenAIClient.GetChatCompletionsClient("{NomeDoDeployment}");

    var response = await chatClient.GetCompletionsAsync(new ChatCompletionsOptions

    {

        Messages = new[] { new ChatMessage(ChatRole.System, "Você é um assistente."), 

                           new ChatMessage(ChatRole.User, prompt) }

    });

    return response.Value.Choices[0].Message.Content;

}

- Aqui, consideramos que no Azure OpenAI você criou um deployment do modelo (ex: GPT-3.5-Turbo) e está acessando via GetChatCompletionsClient. Adaptar conforme SDK (o exemplo baseia-se em chamdas do Azure.AI.OpenAI SDK). Use opções necessárias (model, temperatura, etc.). No contexto do fluxo, GerarSumarizacaoAsync utilizaria esse método para obter um resumo do texto e armazenar em contexto.
- Azure Cognitive Search (ArmazenarEmMemoriaVetorial): Suponha que essa etapa de fluxo pega um documento ou seu embedding e salva no índice para futuras buscas semânticas:

private async Task ArmazenarVetorialAsync(ExecutionContext ctx)

{

    var docId = ctx.Get<string>("DocumentoId");

    var texto = ctx.Get<string>("TextoExtraido");

    // Gerar embedding do texto usando OpenAI

    var embedding = await \_azure.OpenAIClient.GetEmbeddingsAsync(texto);

    // Montar documento do índice

    var indexDoc = new { 

        Id = docId, 

        Content = texto, 

        ContentVector = embedding.Value.Embedding, 

        // ... outros campos 

    };

    await \_azure.SearchClient.UploadDocumentsAsync(new[] { indexDoc });

}

- Este pseudo-código demonstra:

    - Obtém um embedding via OpenAI (Azure OpenAI tem operação GetEmbeddings).
    - Usa o SearchClient (Azure.Search.Documents) para indexar o documento com seu vetor (certifique-se que o índice foi criado com um campo do tipo Edm.SingleCollection para vetores e que o serviço aceita vector search).
    - Mais tarde, consultas semânticas podem usar o endpoint do Search para recuperar conteúdo relevante dado uma consulta (fluxos futuros de Q&A poderiam usar isso).
- 
- Azure Cosmos DB (Registro de Eventos): Implementado em EventLoggerService.RegistrarEventoAsync:

public async Task RegistrarEventoAsync(EventoAje evento)

{

    var container = \_cosmosClient.GetContainer("IREAJE\_DB", "EventosGraph");

    // Cosmos (SQL API) insertion example. Para Gremlin, seria através de GremlinClient.

    await container.CreateItemAsync(evento, new PartitionKey(evento.ContextId ?? evento.Tipo));

}

- No caso do Gremlin API, você teria que usar gremlin queries para inserir vértices e arestas:

// Pseudo-código Gremlin:

string gremlinQuery = $"g.addV('{evento.Tipo}')"+

                      $".property('id','{evento.ContextId}-{evento.Timestamp.Ticks}')"+

                      ".property('Timestamp','...')";

gremlinClient.SubmitAsync<dynamic>(gremlinQuery);

- Para simplificar, usar o SQL API do Cosmos com estrutura relacional é possível, mas o ideal para modelagem de eventos correlacionados é o Gremlin (grafo). Mantenha como melhoria futura caso não esteja familiar agora.
- Azure Functions (Monitores .ire): Configure sua Azure Function de monitoramento (como mencionado no Passo 2) para chamar de volta a API ou logicamente interagir:

    - Exemplo: uma Function com trigger no container Cosmos EventosGraph. No código da Function (que pode compartilhar o assembly de Parsers e MonitorIre models), você escreveria:
- 

public static class MonitorIreFunction {

    private static readonly List<MonitorIre> Monitores = CarregarMonitores(); // parse .ire files or config

    [FunctionName("VerificarPadraoEvento")]

    public static async Task Run([CosmosDBTrigger(...)] IReadOnlyList<EventoAje> novosEventos)

    {

        foreach(var evento in novosEventos)

        {

            foreach(var monitor in Monitores)

            {

                if(monitor.CorrelacoesDetectadas.Contains(evento.Tipo))

                {

                    bool padraoAtendido = VerificarCorrelacao(monitor, evento);

                    if(padraoAtendido)

                    {

                        // Execute ações automatizadas, e.g.:

                        foreach(string acao in monitor.AcoesAutomatizadas)

                        {

                            ExecutarAcaoAutomatizada(acao, evento);

                        }

                    }

                }

            }

        }

    }

}

- 
    - Nesta função, VerificarCorrelacao implementaria a lógica para conferir se, com o novo evento e eventos relacionados anteriores (consultando Cosmos se necessário), o padrão definido é satisfeito. Em caso afirmativo, executa as ações (que podem ser registrar um log, enviar notificação, ou até invocar um fluxo .e específico via HTTP para o backend).
    - 


Lembre-se de configurar as settings de ligação (connection strings etc.) no Function App e de dar permissão (via identidade ou chave) para acesso aos recursos (Cosmos, etc.). As Azure Functions atuarão de forma complementar ao runtime: enquanto o runtime responde em tempo real a eventos do usuário, as Functions tratam de monitoramento contínuo e respostas autônomas.


**Passo 8: Deploy e Configurações Finais no Azure**


Com tudo implementado e testado localmente, prepare o deploy da solução no Azure:

- Publicação do Backend: Como o backend é ASP.NET Core, você pode publicá-lo em um Azure App Service Web App ou em um Azure Container App:

    - App Service: Use o Visual Studio publish ou Azure CLI. Lembre de configurar as Configurações de Aplicativo (Application Settings) correspondentes às chaves do appsettings (AzureSettings, AzureAd, etc.) – elas irão sobrescrever as do appsettings.json em produção. Também habilite “Identity” no App Service (identidade gerenciada do sistema) se você planeja usar MI para Azure OpenAI e outros.
    - Garanta que o App Service tenha o Managed Identity habilitado com as credenciais necessárias (OpenAI, etc. conforme passo 2).
    - Atribua o ClientId do App Registration do backend como Authentication no Azure AD (no portal do App Service, configurar Authentication -> usar Azure Active Directory, e selecionar o registro).
    - Se optar por Container: containerize o app (Dockerfile) e rode em Azure Web App for Containers ou Azure Container Apps, igualmente configurando a identidade.
- 
- Publicação do Frontend: Para Blazor WASM hospedado, o front-end é servido pelo próprio App Service (os arquivos estáticos são publicados junto). Basta garantir que as URLs configuradas para redirecionamento estejam corretas no Azure AD e no código. Se fosse um SPA separado (React, etc.), hospedaria talvez no Azure Static Web Apps, mas no nosso caso, está integrado.
- Deploy das Azure Functions: Publique as funções (ex: MonitorIreFunction) no seu Function App. Configure as strings de conexão (Cosmos DB, etc.) ou use identidade gerenciada da Function App conforme disponível. Verifique se a Function tem acesso à DB e outros serviços. Use Application Insights para monitorar execuções.
- Configurar CORS: Se o front-end for servido em domínio diferente do backend (por exemplo, front-end static em um domínio e backend API noutro), configure CORS na API para permitir o URL do front. No App Service (ou no código usando app.UseCors).
- Testes em Produção: Após deploy, realize um teste completo:

    - Acesse o front-end URL (por exemplo, a URL do App Service). Faça login via Azure AD.
    - Dispare uma ação no UI que corresponda a um evento .aje inicial (ex: preencher um formulário e enviar, ou clicar num botão que gere um evento específico).
    - Verifique no backend (logs do App Service ou Application Insights) se o evento foi recebido e o fluxo .e foi executado corretamente. Qualquer erro de configuração (como credenciais inválidas) aparecerá nos logs.
    - Verifique se os serviços Azure foram chamados: por exemplo, se havia uma chamada ao OpenAI, veja no portal do Azure OpenAI se as métricas de uso incrementaram; se evento salvo no Cosmos, inspecione o container; etc.
    - Verifique se a resposta chegou ao usuário (ex: resumo exibido, notificação de sucesso, etc.).
- 


Ajuste configurações conforme necessário (ex: roles no Azure AD, cors, parâmetros do modelo OpenAI) até tudo funcionar fim-a-fim.


**Passo 9: Exemplo de Execução de Fluxo End-to-End**


Vamos amarrar todas as etapas através de um exemplo concreto: Processamento Inteligente de Documento (baseado no modelo .e dado).

Cenário: O usuário quer processar um documento no GoPilot (por exemplo, fazer upload de um PDF e receber um resumo e classificação).

- Etapa 1 (Front-end): O usuário logado acessa a página “Processar Documento” e envia um arquivo. O front-end Blazor chama a API RuntimeController.ExecutarFluxo com um evento .aje de início:

Re{ReceberDocumento}.aje:{

  "DocumentoId": "doc123",

  "NomeArquivo": "relatorio.pdf",

  "ConteudoBase64": "<base64 do PDF>",

  "Timestamp": "2025-04-29T15:00:00Z",

  "ContextId": "processo-456"

}

- Esse JSON representa que um documento foi recebido para processamento. O ContextId associa este evento a um contexto (poderia ser um ID de processo ou usuário).
- Etapa 2 (Registro do Evento): No backend, o parser .aje converte para EventoAje (Tipo = ReceberDocumento, Parametros = {…}). O EventLoggerService armazena o evento no Cosmos DB (podemos criar um vértice “ReceberDocumento” no grafo com propriedades do arquivo).
- Etapa 3 (Identificação do Fluxo): O runtime encontra um fluxo .e cujo início seja “ReceberDocumento”. O fluxo ProcessamentoDocumentoInteligente corresponde. Ele será executado.
- Etapa 4 (Execução Orquestrada):

    1. AnalisarMetadados: O handler extrai metadados do arquivo (p. ex., tipo, número de páginas). Suponha que obtemos: TipoDocumento=PDF, Paginas=10. Armazena-se no contexto.
    2. ExtrairConteudo: Usa talvez o Azure Cognitive Services Form Recognizer ou outro método para extrair texto do PDF. O texto extraído é colocado em ctx.Set("TextoExtraido", "...conteúdo do PDF..."). Se falhar (arquivo corrompido, formato inválido), poderia marcar ctx.Set("FormatoInvalido", true) e isso seria capturado em CondicoesInterrupcao mais adiante para abortar.
    3. ClassificarDocumento: Talvez um modelo de IA ou lógica interna classifica o tipo de documento (ex: “Relatório Financeiro”). Poderia usar Azure OpenAI para classificação ou um modelo custom. Resultado CategoriaDocumento no contexto.
    4. EnriquecerComContexto: Opcionalmente pega informações adicionais – por exemplo, buscar em uma base (Azure Search) dados relacionados a algum termo chave do documento para contexto adicional. Esse passo pode consultar o índice do Cognitive Search: SearchClient.Search<Doc>("termo") e anexar resultados ao contexto.
    5. GerarSumarizacao: Chama Azure OpenAI para gerar um resumo do texto extraído. Conforme o handler antes, envia prompt e obtém resposta. Armazena Resumo no contexto.
    6. ArmazenarEmMemoriaVetorial: Calcula embedding do texto (ou do resumo) via OpenAI e salva no índice de busca vetorial para consultas futuras. O DocumentoId serve como chave; assim, no futuro, se usuário fizer uma pergunta, o sistema pode recuperar esse documento via similaridade.
    7. NotificarUsuario: Este passo final da sequência pode, por exemplo, enviar de volta ao front-end o resultado. Como estamos em contexto HTTP, podemos simplesmente preparar a resposta. No caso de usar SignalR, enviar uma mensagem ao cliente indicando “Processamento concluído para doc123”.
    8. (Fluxo termina sequência) Verifica CondicoesInterrupcao em cada passo – se alguma condição listada ocorreu, teria quebrado o loop mais cedo. Supondo sucesso, seguimos.
    9. AcoesAoFinalizar:

        - RegistrarLogProcessamento: O handler correspondente talvez insere um registro em um log (Cosmos ou App Insights) com os dados do processamento (tempo gasto, usuário, sucesso/falha).
        - AtualizarEstatisticas: Poderia incrementar contadores em algum lugar (quantos docs processados etc.).
        - GerarRelatorioExecucao: Gera um relatório final do fluxo (talvez um objeto JSON contendo metadados + resumo) e salva em Cosmos ou retorna.
    10. 
- 
- Etapa 5 (Resposta ao Usuário): O controller retorna ao front-end a saída principal. No nosso exemplo, poderíamos retornar o resumo gerado. O front-end então exibe: “Resumo do documento doc123: …” para o usuário, juntamente com talvez a categoria identificada.


Enquanto isso, todos os eventos gerados poderiam ser registrados:

- O ReceberDocumento já foi registrado.
- Podemos definir que cada passo relevante também registra um evento .aje (por exemplo, após extrair conteúdo, registrar um evento Re{ConteudoExtraido} com docId e talvez um hash do conteúdo; após sumarização, um Re{SumarizacaoGerada} contendo o resumo gerado, etc.). Isso enriquece o grafo de eventos e permite auditoria completa do fluxo. Tais registros podem ser feitos dentro dos handlers ou centralizados via orquestrador.


Monitores .ire: Se houvesse um monitor para detectar falhas repetidas, ex: após 3 documentos com FormatoInvalido, acionar um alerta ao administrador – os eventos FormatoInvalido (condição de interrupção) poderiam ter sido registrados e então a Azure Function de monitor iria detectar o padrão e disparar ação automatizada (conforme definirmos em um .ire monitorado pelo Function).

Este exemplo ilustra como o runtime atua como “cola” entre diversas capacidades: o front-end, o armazenamento de eventos, a lógica de negócio (fluxos .e) e os serviços de IA. Tudo acontecendo dentro do contexto seguro autenticado do usuário.


**Passo 10: Preparando Expansões Futuras**


A arquitetura proposta prioriza a facilidade de expansão para incorporar agentes inteligentes, novas ferramentas e handlers baseados em linguagem natural no futuro. Algumas considerações para expansão:

- Novos Fluxos .e: Para adicionar uma nova capacidade, basta criar um novo arquivo .e definindo a sequência de operações, implementar os handlers correspondentes no orquestrador e implantá-lo. Por exemplo, poderíamos criar um fluxo AgenteSuporteTI.e que escuta eventos de chat do usuário e executa diagnósticos automáticos, chamando ferramentas específicas. A estrutura modular permite isso sem alterar os fluxos existentes.
- Novos Eventos .aje e Monitores .ire: Da mesma forma, podemos introduzir novos tipos de eventos no sistema (basta começar a capturá-los do front-end ou outras fontes) e definir monitores de correlação. O núcleo do runtime já suporta parsing genérico; apenas acrescentamos classes de modelo se necessário e lógica de tratamento/monitoramento. Isso é útil para construir agentes proativos: e.g., um agente de viagem (ZEOCARE citado para fase posterior) poderia registrar eventos de itinerário, e monitores .ire detectariam combinações (voo atrasado + compromisso próximo) e disparariam fluxos .e de remarcação automática.
- Integração de Ferramentas Externas: Os handlers podem chamar APIs externas ou microserviços adicionais facilmente. Por exemplo, um handler “ConsultarClima” poderia chamar uma API de previsão do tempo para informar um agente. A adição de uma ferramenta significa adicionar um handler no dicionário do orquestrador e seu uso em fluxos .e.
- Aprimoramento do Motor de Linguagem Natural: Atualmente, os fluxos .e são acionados por eventos discretos. Podemos evoluir para interpretar comandos de linguagem natural do usuário diretamente em intenções/fluxos:

    - Exemplo: O usuário digita no chat “Resuma o último relatório financeiro”. Ao invés de exigir um evento explícito .aje, podemos ter um componente de NLP (utilizando Azure OpenAI) que converte essa frase em um evento ou chamada de fluxo adequado (tal lógica às vezes é chamada de Composition Planning ou planejamento de composição de operações). Poderíamos ter um parser adicional para intenções de linguagem natural que seleciona ou monta um fluxo .e dinamicamente com base no pedido do usuário.
    - Esse agent de linguagem natural, usando contexto (memória vetorial dos documentos, eventos passados no grafo .aje), possibilitará conversas mais livres com o sistema, indo além de sequências pré-definidas.
- 
- Separação de Serviços: Embora nesta primeira versão integramos tudo no monolito ASP.NET Core por simplicidade e latência, a arquitetura suporta extrair componentes para microserviços conforme necessário:

    - O orquestrador .e poderia virar um serviço isolado ou workflow engine compartilhado.
    - Os handlers mais pesados (ex: processamento de arquivos) poderiam ser funções dedicadas ou filas.
    - O grafo de eventos em Cosmos pode ser consultado por outros aplicativos paralelos (ex: um painel de analytics).
    - Essa separação, contudo, deve ser avaliada diante do requisito de baixa latência. Sempre busque manter próxima do usuário qualquer lógica que necessite resposta rápida (por isso escolhemos ExecutionRuntime em memória).
- 
- Monitoração e Logs: Expanda o uso de Application Insights para coletar métricas por tipo de fluxo, tempo de resposta por etapa, etc. Isso ajudará a identificar gargalos e planejar escala.
- Segurança e Compliance: Ao crescer, implemente controles como:

    - Sanitização de prompts enviados ao OpenAI (evitar vazamento de dados sensíveis inadvertidamente).
    - Policies de tempo de execução (não permitir que fluxos rodem indefinidamente – talvez impor timeouts ou limite de passos).
    - Controles de acesso mais granulares a fluxos (ex: um fluxo de “admin” não pode ser invocado por usuário comum mesmo que ele saiba o evento de início).
- 


Por fim, a integração do runtime IREAJE.CLOUD no GoPilot Client demonstrou como um sistema modular de DSLs pode orquestrar interações complexas entre usuário e serviços de nuvem de maneira transparente. Temos uma base sólida para evoluir tanto a aplicação atual quanto para construir o projeto ZEOCARE e outros agentes inteligentes aproveitando a mesma infraestrutura. Basta adicionar novos blocos (fluxos/eventos/ações) que o mecanismo central já os conectará de forma eficiente e consistente.



Referências técnicas selecionadas: O design do runtime e DSLs IREAJE.CLOUD baseia-se nos princípios de separação de camadas e eficiência euleriana. A utilização do Azure seguiu recomendações de serviços adequados a cada componente (ex.: Cosmos DB para grafo de eventos, Azure Functions para processamento de eventos, cache Redis para estado de runtime). A autenticação emprega Microsoft Entra ID conforme guia oficial da Microsoft para Blazor WebAssembly protegido por Azure AD .
