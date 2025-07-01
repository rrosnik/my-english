# My English Dictionary - Monorepo

A modern English learning application built with React and Express.js using Nx monorepo architecture.

## 📁 Project Structure

```txt
apps/
├── web/           # React frontend application
├── server/        # Express.js backend API
└── server-e2e/    # End-to-end tests for server
libs/              # Shared libraries (future)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (package manager)

### Installation

```bash
pnpm install
```

### Development

Start both applications:

```bash
pnpm dev
```

Or start individually:

```bash
# Web application (http://localhost:4200)
pnpm dev:web

# API server (http://localhost:3333)
pnpm dev:server
```

### Building

Build all applications:

```bash
pnpm build
```

Build individually:

```bash
pnpm build:web
pnpm build:server
```

### Testing

Run all tests:

```bash
pnpm test
```

### Linting

Lint all applications:

```bash
pnpm lint
```

## 📖 Applications

### Web App (`apps/web`)

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: React Bootstrap
- **State Management**: Redux Toolkit
- **Testing**: Vitest
- **Storybook**: Component documentation

**Features:**

- Dictionary word extraction from URLs
- Flashcard system for learning
- PWA support
- Firebase authentication
- Responsive design

### Server API (`apps/server`)

- **Framework**: Express.js with TypeScript
- **Build Tool**: Webpack (via Nx)
- **Testing**: Jest

**API Endpoints:**

- `GET /api` - API information
- `GET /api/health` - Health check
- `POST /api/extract` - Extract word data from dictionary URLs
- `GET /api/words` - Retrieve saved words

## 🛠 Technology Stack

- **Monorepo**: Nx
- **Package Manager**: pnpm
- **Frontend**: React, TypeScript, Vite
- **Backend**: Express.js, TypeScript
- **Testing**: Jest, Vitest
- **Linting**: ESLint
- **Formatting**: Prettier

## 📝 Available Scripts

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications for production
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm graph` - View dependency graph
- `pnpm storybook` - Start Storybook for web app

## 🔧 Development Workflow

1. **Adding Dependencies**: Use `pnpm add -w <package>` for workspace-wide dependencies
2. **Creating Libraries**: Use `nx g @nx/js:lib <name>` to create shared libraries
3. **Running Tasks**: Use `nx <command> <project>` or the pnpm scripts
4. **Dependency Graph**: Run `pnpm graph` to visualize project dependencies

## 📚 Learn More

- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [pnpm Documentation](https://pnpm.io)
