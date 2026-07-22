# Sushi Sudoku 🍣

Protótipo jogável em HTML/CSS/JS puro (sem build step), implementando o
conceito do prompt: Sudoku clássico com peças de sushi, identidade visual
de café japonês, login e progresso salvo na nuvem via Supabase (grátis).

## O que está implementado

- Gerador de Sudoku com backtracking + verificação de solução única
  (6 níveis de dificuldade: Iniciante → Especialista).
- Nunca é possível colocar uma peça errada — a jogada é recusada com
  uma animação, então o tabuleiro nunca fica em estado inconsistente.
- 9 peças de sushi em SVG, com tamanhos e cores propositalmente
  diferentes entre si para facilitar a leitura rápida.
- Fluxo de clique: selecionar o sushi na bandeja → clicar na célula.
  A seleção fica bem evidente (anel, elevação, selo) e desmarca sozinha
  depois de usada.
- Ferramentas: desfazer, refazer, borracha, anotações, dicas (3 por
  partida), reiniciar.
- Cronômetro, contador de progresso.
- Desafio diário (mesma semente para todos que jogarem no mesmo dia).
- 8 temas cosmético-funcionais que trocam a paleta da interface.
- **Login/cadastro por e-mail e senha, com recuperação de senha, via
  Supabase Auth.**
- **Persistência real em Postgres**: partida em andamento, estatísticas
  e histórico, protegidos por Row Level Security (cada usuário só
  acessa os próprios dados).
- Layout responsivo (desktop com painéis laterais / mobile com
  ferramentas empilhadas e tabuleiro em largura quase total).
- Pétalas de sakura ambiente + celebração ao concluir o tabuleiro.

## Estrutura

```
sushi-sudoku/
├── index.html            # telas (login, início, jogo, overlays)
├── style.css              # tokens de design e responsividade
├── script.js               # gerador/solver de Sudoku + lógica de jogo
├── cloud.js                 # camada de autenticação e sincronização (Supabase)
├── supabase-config.js        # onde você cola sua URL e chave do Supabase
├── supabase_schema.sql        # schema SQL (tabelas + RLS + trigger)
└── README.md
```
