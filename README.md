# Sushi Sudoku 🍣

Sudoku clássico reimaginado com peças de sushi, identidade visual de café japonês, autenticação e persistência em nuvem. Aplicação client-side pura, sem framework e sem build step.

## Stack

- HTML5 / CSS3 — layout, temas e responsividade via CSS custom properties (design tokens), sem pré-processador.
- JavaScript (Vanilla ES6+) — toda a lógica de jogo, geração de puzzles e orquestração de UI, sem framework (React/Vue) e sem bundler.
- Supabase
  - Postgres — persistência de partidas, estatísticas e histórico.
  - Supabase Auth (GoTrue) — cadastro/login por e-mail e senha, recuperação de senha.
  - Row Level Security (RLS) — isolamento de dados por usuário aplicado no nível do banco.
  - supabase-js v2 (via CDN) — client SDK, sem etapa de instalação/npm.
- SVG inline — todos os ícones das peças de sushi são gerados via markup SVG, sem assets de imagem.

Sem dependências de build (Webpack/Vite/etc.) — o projeto roda direto abrindo `index.html` ou servindo os arquivos estaticamente.

## Funcionalidades

- Gerador de Sudoku com backtracking e verificação de solução única, com 6 níveis de dificuldade (Iniciante → Especialista).
- Validação em tempo real: jogadas incorretas são recusadas com feedback visual, garantindo que o tabuleiro nunca fique em estado inconsistente.
- 9 peças de sushi em SVG, com variação intencional de tamanho e cor para leitura rápida.
- Fluxo de interação: seleção da peça na bandeja → aplicação na célula, com destaque visual persistente da peça selecionada.
- Ferramentas de jogo: desfazer, refazer, borracha, anotações, sistema de dicas limitado, reinício de partida.
- Cronômetro e indicador de progresso.
- Desafio diário com seed determinística (mesmo puzzle para todos os jogadores no mesmo dia).
- Sistema de temas — paletas de cores intercambiáveis via CSS custom properties.
- Autenticação completa (cadastro, login, recuperação de senha) via Supabase Auth.
- Persistência em nuvem: partida em andamento, estatísticas e histórico de jogos, protegidos por RLS por usuário.
- Modo local: jogo funcional sem autenticação, sem persistência.
- Layout responsivo para desktop e mobile.
- Áudio ambiente com controle de reprodução.
- Efeitos visuais ambientais (partículas) e animação de conclusão de partida.

## Estrutura do projeto

```text
sushi-sudoku/
├── index.html               # Markup das telas (auth, home, jogo, overlays)
├── style.css                # Design tokens e regras de responsividade
├── script.js                # Gerador/solver de Sudoku, estado e lógica de jogo
├── cloud.js                 # Camada de integração com Supabase (auth + sync)
├── supabase-config.example.js # Template de configuração (URL + anon key)
├── supabase_schema.sql      # Schema SQL: tabelas, políticas RLS e triggers
└── README.md
```

## Configuração

O projeto requer um projeto Supabase (camada gratuita é suficiente):

1. Execute `supabase_schema.sql` no SQL Editor do projeto Supabase para provisionar tabelas, políticas de RLS e triggers.
2. Copie `supabase-config.example.js` para `supabase-config.js` e preencha com a URL do projeto e a anon key (Project Settings → API).
3. `supabase-config.js` é ignorado via `.gitignore` — não deve ser versionado.

Sem configuração, o app detecta a ausência de credenciais válidas e opera automaticamente em modo local, sem autenticação ou sincronização.

## Segurança

A anon key do Supabase é uma chave pública por design; o isolamento de dados é garantido por Row Level Security no Postgres, não pelo sigilo da chave.

Todas as tabelas de usuário (`game_saves`, `game_stats`, `game_history`, `profiles`) possuem políticas RLS restringindo acesso ao próprio `auth.uid()`.
