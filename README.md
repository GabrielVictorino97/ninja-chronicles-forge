# Naruto Players Fan Game — Frontend

Frontend web de um RPG ninja inspirado no antigo **Naruto Players 2.0**, desenvolvido como **projeto pessoal / fan game sem fins comerciais**. Este repositório contém **apenas o frontend** — o backend oficial será implementado separadamente em **C# / .NET**.

> ⚠️ Projeto não-oficial, sem afiliação com a obra original. Nenhum asset oficial é utilizado.

---

## ✨ Visão geral

O projeto entrega duas experiências completas, totalmente navegáveis com dados mockados:

- **Game Client (`/`)** — interface do jogador: dashboard, personagem, missões, batalha PvE, jutsus, inventário, loja, clã, ranking e mapa.
- **Painel Administrativo (`/admin`)** — dashboard de métricas, CRUDs de usuários, personagens, vilas, clãs, jutsus, missões, itens, eventos, batalhas, rankings, audit logs e configurações de balanceamento.

Tudo funciona com uma camada de **services mockados** já estruturada para ser substituída por chamadas REST reais ao backend C#.

---

## 🧰 Stack técnica

- **React 19** + **TypeScript** (strict)
- **TanStack Start v1** + **TanStack Router** (file-based routing, SSR-ready)
- **Vite 7** como bundler
- **TailwindCSS v4** + **shadcn/ui** (design tokens semânticos em `src/styles.css`)
- **Zustand** para estado global (`gameStore`, `adminStore`)
- **React Hook Form** + **Zod** para formulários
- **Lucide Icons** + **Sonner** (toasts)

---

## 🚀 Como rodar

```bash
bun install
bun run dev
```

A aplicação sobe em `http://localhost:5173`.

### Scripts úteis

| Comando | Descrição |
|---|---|
| `bun run dev` | Ambiente de desenvolvimento |
| `bun run build` | Build de produção |
| `bun run start` | Roda o build de produção |

---

## 🔐 Como acessar

O protótipo já vem com **dados de demonstração** semeados automaticamente.

### Game Client
- Acesse `/login`
- Use as credenciais pré-preenchidas (`shinobi@vila.gg` / `123456`) **ou** clique em **“Entrar como demo”**
- Você será redirecionado para `/dashboard`

### Painel Administrativo
- Acesse diretamente **`/admin`** (ou `/admin/dashboard`)
- O controle de acesso real será implementado pelo backend C#; no protótipo a rota está liberada para facilitar a navegação

---

## 📂 Estrutura de pastas

```
src/
├── components/
│   ├── admin/            # Componentes do painel admin (DataTable, CrudPage, StatCard, MiniChart...)
│   ├── game/             # Componentes do jogo (RankBadge, RarityBadge, StatBar, SectionTitle)
│   ├── layout/           # AppLayout (game)
│   └── ui/               # shadcn/ui
├── mocks/                # Dados mockados (personagens, jutsus, missões, vilas, admin, etc.)
├── routes/               # Rotas file-based (TanStack Router)
│   ├── _app.*.tsx        # Rotas autenticadas do game
│   ├── admin.*.tsx       # Rotas do painel admin
│   ├── login.tsx, register.tsx, create-character.tsx
│   └── __root.tsx
├── services/             # Camada de API (mocks prontos para virar fetch ao C#)
│   ├── admin/            # adminUserService, adminJutsuService, adminSettingsService...
│   └── *.ts              # authService, characterService, battleService, missionService...
├── store/                # Zustand stores
├── types/                # Tipagens compartilhadas (game + admin)
├── styles.css            # Design tokens (oklch) + Tailwind v4
└── router.tsx
```

---

## 🔌 Integração futura com o backend C# / .NET

Toda comunicação com o servidor passa pela camada `src/services/`. Hoje cada service usa o helper `mockRequest()` de `src/services/api.ts`. Para integrar com a API real, basta substituir o corpo de cada função por um `fetch("/api/...")` — as **assinaturas e tipos permanecem iguais**, então o restante do app não precisa ser tocado.

Exemplo:

```ts
// Antes (mock)
export const characterService = {
  get: (id: string) => mockRequest(mockCharacter),
};

// Depois (API real)
export const characterService = {
  get: (id: string) =>
    fetch(`/api/characters/${id}`).then((r) => r.json()),
};
```

Endpoints sugeridos seguem o nome de cada service (`adminUserService` → `/api/admin/users`, etc.).

---

## 🎨 Design system

- Tokens semânticos em **oklch** definidos em `src/styles.css` (`--primary`, `--accent`, `--chakra`, `--hp`, `--ryous`, gradientes e sombras de glow).
- **Nunca** usar cores literais (`text-white`, `bg-black`) nos componentes — sempre os tokens.
- Tema dark por padrão, com visual de **game web moderno**.

---

## ✅ Funcionalidades implementadas (mock)

**Game**
- Login / Registro / Criação de personagem
- Dashboard com status, missões e atalhos
- Missões simuladas (iniciar, recompensa)
- Batalha PvE simulada (turnos, dano, drops)
- Aprender e equipar jutsus
- Inventário, loja, clã, ranking e mapa interativo
- Transições suaves entre telas

**Admin**
- Dashboard com métricas e gráficos SVG (sem libs externas)
- CRUDs genéricos via componente `CrudPage<T>`
- Gestão de usuários (banir, bloquear, mudar role) e personagens (resetar, bloquear)
- Configurações globais de balanceamento (XP, energia, drops, cooldowns)
- Audit logs e histórico de batalhas

---

## 📜 Licença & aviso legal

Projeto **fan-made**, **não-comercial**, criado com fins de estudo e nostalgia. Naruto e seus personagens pertencem a Masashi Kishimoto / Shueisha / TV Tokyo / Pierrot. Este repositório **não distribui assets oficiais** e não possui qualquer vínculo com os detentores da marca.
