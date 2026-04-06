# 📝 Mdown - Professional Markdown Editor

A production-grade, macOS-native Markdown editor built with Tauri, React, and TypeScript.

## 🚀 Key Features

- **Split View Editing**: Real-time preview with bidirectional scroll synchronization.
- **Native File Operations**: Full support for Open, Save, and Save As using native macOS dialogs.
- **Widget System**: Extensible sidebar widgets (Table of Contents, Word Counter, Reading Time).
- **Theme System**: Multiple curated themes with a glassmorphism design.
- **Auto-save**: Never lose your progress with periodic persistence.
- **Keyboard Shortcuts**: Native-feeling CMD+S, CMD+O, and formatting shortcuts.
- **Recent Files**: Quick access to your most recently edited documents.

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript 6.0, Vite 8.0
- **Backend**: Tauri 2.10 (Rust)
- **Styling**: Tailwind CSS 4.0
- **State Management**: Zustand 5.0
- **Storage**: IndexedDB (via Dexie)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS)
- [Rust](https://www.rust-lang.org/) (latest stable)

### Installation

```bash
npm install
```

### Development

Run the development environment (React + Tauri):

```bash
npm run tauri:dev
```

### Build

Build the production application:

```bash
npm run tauri:build
```

## ⌨️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build frontend production assets |
| `npm run tauri:dev` | Start the Tauri application in dev mode |
| `npm run tauri:build` | Build the Tauri application for distribution |
| `npm run lint` | Run ESLint check |

## 📁 Project Structure

- `src/`: React frontend source code
  - `components/`: Reusable UI components
  - `editor/`: Core editor and layout components
  - `hooks/`: Custom React hooks (scroll sync, shortcuts)
  - `services/`: Business logic and backend interaction
  - `store/`: Zustand state management
  - `widgets/`: Sidebar widget system
- `src-tauri/`: Rust backend and Tauri configuration

## 📄 License

MIT
