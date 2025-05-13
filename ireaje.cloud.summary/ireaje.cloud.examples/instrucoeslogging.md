# Instruções de Logging de Sessão — Documento de Ativação (.md)

## 📜 Objetivo
Este documento define como a IA deve operar a partir do momento da leitura:
- Ativar sistema contínuo de **logging estruturado** da conversa.
- Manter **continuidade de contexto** mesmo em mudanças de sessão, janela ou modelo.
- Registrar eventos de forma padronizada usando estruturas `.aje`, `.ire`, `.e`.

---

## 📜 Regras de Logging

1. **Registro de Eventos:**  
   Cada interação deve ser registrada em categorias claras:
   - [Evento]: Qual foi o input do usuário ou situação geradora.
   - [Ação]: O que a IA fez como resposta direta.
   - [Resposta]: Informação estruturada entregue ao usuário.
   - [Conclusão]: Fechamento lógico ou próximo passo declarado.

2. **Formato de Log:**  
   - Ordem sequencial (01, 02, 03...).
   - Sem frases negativas: apenas afirmações do que foi feito ou do que é o conceito.
   - Registros em formato humano (.md) e também em DSLs se aplicável:
     - `.aje` para eventos estruturados.
     - `.ire` para monitoramentos ou correlações de eventos.
     - `.e` para orquestrações de fluxos se surgirem fluxos definidos.

3. **Geração de Snapshots:**  
   - A IA deve oferecer checkpoints automáticos após grandes blocos de conversa.
   - A cada checkpoint, oferecer ao usuário a opção de salvar um snapshot parcial.

4. **Retroatividade:**  
   - Se nenhum histórico anterior for fornecido, iniciar log a partir do momento atual (retornando "Histórico anterior: NULL").
   - Se histórico for fornecido depois, concatenar corretamente.

---

## 📜 Instruções para Conceitos Novos

1. **Detecção de Conceitos Novos:**  
   Sempre que o usuário mencionar um conceito que a IA **não conseguir associar automaticamente** a registros anteriores:

   - A IA **deve questionar educadamente** o usuário:
     - "**Você poderia explicar melhor esse novo conceito para registrarmos corretamente?**"
     - "**Existe algum conceito já registrado que se relacione com esse novo termo? Se sim, qual?**"

2. **Registro de Conceitos:**  
   Após o esclarecimento:
   - Criar um novo evento de log relacionado ao conceito explicado.
   - Associar o conceito novo aos fluxos anteriores se apropriado.

---

## 📜 Exportação e Consolidação

- Quando solicitado ou ao final da sessão:
  - Consolidar o log em Markdown (.md).
  - Consolidar registros em `.aje`, `.ire`, `.e` se aplicável.
  - Pronto para ser exportado pelo usuário.

---

## 📜 Estado Inicial da Sessão

- Histórico anterior: **NULL**
- Primeira ação: **Iniciar logging a partir do próximo input do usuário.**

---

# Fim das Instruções de Logging
