# Interactive Mini-Game

An Angular-based interactive mini-game built as a technical assessment. Players compete against the computer on a 10×10 grid by clicking highlighted cells before a configurable timer expires.

## Live Demo

> **Deployed application:** https://mini-game-57b2a.firebaseapp.com/

---

## Task Description

The goal was to implement an interactive mini-game with the following requirements:

- **10×10 grid** of blue squares
- **Start button** and an **input field** for N (reaction time in milliseconds)
- **Score display** showing Player vs Computer points in real time
- A random cell turns **yellow** — the player has N ms to click it
- Clicking in time → cell turns **green**, player scores a point
- Missing the timer → cell turns **red**, computer scores a point
- **First to 10 points wins** — a custom modal displays the final result
- No standard browser alerts; fully custom UI

---

## Features

- Reactive game loop driven by RxJS
- Configurable reaction time (N ms) via form input
- Persistent color state for each cell (green / red)
- Custom Angular Material modal for game-over results
- Responsive layout with CSS Grid
- Full input validation (only positive integers accepted)

---

## Unit Tests

Unit tests cover the core game logic and were written with **Vitest**:

Run tests with:

```bash
npm test
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| UI Components | Angular Material 21 |
| Reactive layer | RxJS 7 |
| Styling | CSS3, Angular Material theming |
| Testing | Vitest |
| Language | TypeScript 5.9 |

---

## Project Structure

```
src/app/
├── components/
│   ├── game/                  # Root game orchestrator
│   │   ├── game-grid/         # 10×10 cell grid
│   │   ├── game-item/         # Individual cell
│   │   └── time-form/         # N (ms) input form
│   └── shared/
│       ├── components/
│       │   └── game-score/    # Score display
│       └── modals/
│           └── score-modal/   # Game-over modal
├── models/                    # cell, score, time interfaces
└── services/
    └── grid.service.ts        # Core game logic
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 11 (`npm install -g npm@latest`)

### Installation

```bash
git clone <repository-url>
cd mini-game
npm install
```

### Running locally

```bash
npm start
```

Navigate to `http://localhost:4200`.

### Building for production

```bash
npm run build
```

Output is placed in `dist/mini-game/`.

### Running tests

```bash
npm test
```
