# EchoGPT Redesign

A clean, minimal frontend redesign of [EchoGPT](https://echogpt.live) — built with Next.js 16 (App Router), React 19, and Tailwind CSS.

## Overview

This project redesigns EchoGPT's multi-model AI workspace with a focus on simplicity, speed, and typography. The interface cuts away clutter to put conversations and model comparisons front and center, complemented by a dedicated Chrome Manifest V3 side panel extension.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React
- **State Management**: Zustand (persisted to `localStorage`)
- **Browser Extension**: Chrome Manifest V3 Side Panel API
- **Type Safety**: TypeScript 5 (strict mode)

## Pages & Features

- **Chat Workspace** (`/app`): Minimal chat interface with conversation history, inline model switcher, reasoning trace toggles, and a `⌘K` command palette.
- **Model Arena** (`/app/compare`): Side-by-side prompt testing across multiple frontier models (Claude 3.5 Sonnet, DeepSeek R1, GPT-4o) with latency and token metrics.
- **Chrome Extension** (`/extension`): Standalone Manifest V3 side panel with webpage context extraction and selected text actions.
- **Extension Simulator** (`/app/extension-preview`): In-app preview to test the extension side panel at 320px, 380px, and 460px widths.
- **Pricing Plans** (`/pricing`, `/app/pricing`): Four tiers (Free, Plus, Pro, Max) with monthly/yearly billing toggle and currency switching.
- **Settings** (`/app/settings`): Appearance preferences, model roster toggles, and local API key management.
- **Landing Page** (`/landing`): Clean marketing page highlighting core features, model directory, and FAQ.

## Getting Started

### Prerequisites

- Node.js ≥ 18.17
- npm ≥ 9

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd "EchoGPT Frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (redirects to `/app`).

### Build & Verification

```bash
# Production build
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Extension test suite
npm run test:extension
```

## Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select the `extension/` directory.
4. Press `Alt + E` or click the extension icon to open the side panel.

## Project Structure

```
├── extension/              # Standalone Chrome Manifest V3 extension
├── public/                 # Static assets & extension build files
├── scripts/                # Extension build and verification scripts
└── src/
    ├── app/                # Next.js App Router (pages & layouts)
    ├── components/         # Feature components (chat, compare, marketing, pricing)
    └── shared/             # UI primitives, stores, types, and mock data
```

## Notes

- **Mock Data**: All model responses, streaming tokens, and conversation history are simulated client-side for demonstration. No external API keys or backend connections are required.
- **Local Persistence**: User settings, theme preferences, and chat history persist locally in your browser via `localStorage`.
