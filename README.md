# ZEOCARE & ZeoCare

![Logo ZeoCare](zc-radar-dimensional.svg)

## Visão Geral

O ZEOCARE (Visualização INtegrativa TRAjetorial) é um framework revolucionário para documentação clínica em saúde mental que substitui os diagnósticos categoriais tradicionais por uma abordagem vetorial-dimensional. Este repositório contém a documentação técnica, especificações e recursos visuais do sistema ZEOCARE e do app ZeoCare.

### Características Principais

- **Abordagem Dimensional**: Mapeamento da experiência mental em 10 dimensões precisas
- **Vetorialidade**: Representação matemática dos estados mentais em um espaço multidimensional
- **Análise Trajetorial**: Foco em padrões de movimento dimensional ao longo do tempo
- **Visualização Significativa**: Representações visuais intuitivas de dados complexos
- **Integração com DataWeaver**: Conexão com data lake anonimizado para processamento em escala

## Arquitetura Dimensional

O ZEOCARE organiza a experiência mental em 10 dimensões fundamentais agrupadas em três metadimensões:

### Dimensão Emocional

1. **Valência Emocional** (-5 a +5): Polaridade hedônica da experiência
2. **Excitação Emocional** (0-10): Grau de ativação neurofisiológica
3. **Dominância Emocional** (0-10): Percepção de controle sobre a experiência
4. **Intensidade Afetiva** (0-10): Magnitude experiencial da emoção

### Dimensão Cognitiva

5. **Complexidade Sintática** (0-10): Elaboração estrutural do pensamento
6. **Coerência Narrativa** (0-10): Integração lógico-temporal de elementos
7. **Flexibilidade Cognitiva** (0-10): Capacidade de alterar esquemas mentais
8. **Dissonância Cognitiva** (0-10): Tensão entre elementos cognitivos incompatíveis

### Dimensão Autonomia

9. **Perspectiva Temporal** ([passado, presente, futuro]): Orientação experiencial no contínuo temporal
10. **Autocontrole** (0-10): Capacidade de autorregulação comportamental

## Componentes do Sistema

### ZEOCARE (Framework de Documentação)

O framework base para avaliação, registro e visualização dimensional, que inclui:

- **Entrevista Dimensional Estruturada (EDE)**
- **Registro Clínico Dimensional (RCD)**
- **Sistema de Visualização Radar & Trajetorial**
- **Pipeline de Processamento Linguístico**

### Health/Health (Aplicativo)

Aplicativo móvel para pacientes que oferece:

- **Auto-monitoramento dimensional**
- **Visualização de trajetórias pessoais**
- **Registro seguro de dados**
- **Interface com profissionais autorizados**

### DataWeaver (Data Lake)

Infraestrutura de dados que proporciona:

- **Armazenamento anonimizado**
- **Processamento em grande escala**
- **Análise de padrões populacionais**
- **Base para modelos preditivos**

## Documentação

O repositório contém os seguintes documentos essenciais:

- [Manual Técnico](zeocare/zc-manual-tecnico.md): Instruções detalhadas para implementação
- [Especificações Técnicas](zeocare/zc-especificacoes-tecnicas.md): Documentação formal do sistema
- [Pipeline de Processamento](zeocare/zc-pipeline-embeddings-ontologias-grafos.md): Detalhes do fluxo de processamento de dados
- [Documento ZEOCARE](zeocare-handbook.md): Visão geral do sistema em português

## Visualizações

O sistema utiliza diversas visualizações para representar dados dimensionais:

- [Radar Dimensional](zeocare/zc-radar-dimensional.svg): Perfil das 10 dimensões
- [Mapa de Dimensões](zeocare/zc-10-dimensoes.svg): Organização das dimensões e metadimensões
- [Trajetórias e Pontos Críticos](zeocare/zc-trajetoria-pontos-criticos.svg): Análise de movimento no espaço dimensional

## Implementação

Para implementar o sistema ZEOCARE:

1. Consulte o [Manual Técnico](zeocare/zc-manual-tecnico.md) para requisitos e procedimentos
2. Utilize o [prompt atualizado](zeocare/zc-prompt-atualizado.md) como modelo para documentação
3. Implemente o componente de [visualização](zeocare/zc-visualization.tsx) em sua aplicação

## Contribuição

Este é um projeto em desenvolvimento ativo. Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para sua branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Tecnologia proprietária da IREAJE

---

© 2025 IREAJE. Todos os direitos reservados.