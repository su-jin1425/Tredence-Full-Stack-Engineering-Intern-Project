# HR Workflow Designer Module

Production-quality internship case study built with React, TypeScript, Vite, React Flow, Tailwind CSS, Zustand, React Hook Form, and Zod.

## Overview

This project lets an HR admin:

- design workflows visually with drag-and-drop nodes
- configure node data from a form-driven side panel
- validate graph structure and required fields
- simulate workflow execution with a mock API
- import/export workflow JSON
- use undo/redo, auto-layout, templates, version history, and dark mode

## Tech Stack

- React
- TypeScript
- Vite
- React Flow (`@xyflow/react`)
- Tailwind CSS
- Zustand
- React Hook Form
- Zod

## Project Structure

```text
src/
  api/
  components/
    canvas/
    forms/
    layout/
    sandbox/
    sidebar/
    common/
  hooks/
  store/
  types/
  utils/
```

## Setup Locally

1. Create the project folder and move into it.
2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal.

## Build for Production

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## How To Use

1. Drag nodes from the left sidebar to the canvas.
2. Connect nodes by dragging handles between them.
3. Select a node to edit it in the right config panel.
4. Use templates for quick workflow starters.
5. Run validation and simulation from the navbar or sandbox panel.
6. Export JSON or import a saved workflow from the top actions.
7. Use undo/redo, auto-layout, dark mode, and version restore as needed.

## Architecture Decisions

- Zustand owns graph state, UI state, history state, and simulation state.
- Validation logic is isolated in `src/utils/validation.ts`.
- Mock API is isolated in `src/api/mockApi.ts`.
- React Flow rendering stays in `src/components/canvas`.
- Form logic stays in `src/components/forms`.
- Serialization/import/export helpers stay in `src/utils/workflow.ts`.
- Auto-layout is implemented without extra dependencies to keep the project lightweight.

## Completed Features

- Visual workflow builder
- Drag-and-drop node creation
- Custom node types
- Node configuration forms with React Hook Form + Zod
- Graph validation rules
- Mock automation API
- Simulation logs timeline
- Import / export JSON
- Undo / redo
- Auto-layout
- Templates
- Validation indicators
- Version history
- Dark mode

## Mock API

### `GET /automations`

Returns:

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]
```

### `POST /simulate`

Accepts serialized workflow JSON and returns execution logs for the sandbox panel.

## Deploy Online

### Vercel

1. Push the project to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. Import the GitHub repository.
4. Framework preset: `Vite`.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy.

### Netlify

1. Push the project to GitHub.
2. Go to [Netlify](https://www.netlify.com/).
3. Add new site from Git.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy.

## Future Improvements

- real backend persistence
- collaborative multi-user editing
- role permissions and audit logs
- edge condition rules
- richer simulation branching
- automated tests and Playwright coverage
