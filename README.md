# PlotLine

PlotLine is an AI-powered interactive fiction app where users define a world, protagonist, genre, and tone, then shape the story through branching choices. Generated scenes are saved so stories can be resumed later.

## Features

- Create custom stories with a title, genre, protagonist, world, and tone
- Generate immersive scenes with Claude through a FastAPI backend
- Receive three meaningful choices at the end of each generated scene
- Continue the narrative based on the user's selected choice
- Preserve previous scenes and choices as context for future generation
- Save stories and scenes in Supabase
- Resume or delete previously created stories
- Anonymous Supabase authentication with persistent sessions
- Dark, reading-focused interface built for interactive fiction

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Supabase
- Lucide React

### Backend

- Python
- FastAPI
- Anthropic API
- Pydantic

## Architecture

```text
React + TypeScript frontend
        |
        | POST /scene
        v
FastAPI backend
        |
        | prompt + story history
        v
Anthropic Claude
        |
        | generated scene + 3 choices
        v
Frontend
        |
        v
Supabase (stories, scenes, choices)
```

When a user starts a story, PlotLine saves the story configuration in Supabase. The frontend sends the current story history and selected choice to the FastAPI `/scene` endpoint. The backend builds a structured prompt, requests the next scene from Claude, parses the JSON response, and returns the scene text and three choices. Generated scenes and selected choices are persisted so the story can be resumed later.

## Run Locally

### Frontend

Install dependencies:

```bash
npm install
```

Create a `.env` file with the required configuration:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_KEY=your_anthropic_api_key
```

Start the frontend:

```bash
npm run dev
```

### Backend

Install the Python dependencies required by `server/main.py`, including FastAPI, Uvicorn, Anthropic, python-dotenv, and Pydantic. Then run the API from the `server` directory:

```bash
uvicorn main:app --reload --port 8000
```

The frontend sends scene-generation requests to `http://localhost:8000/scene`.

## Project Structure

```text
plotline/
├── server/
│   └── main.py
├── src/
│   ├── components/
│   │   ├── Landing.tsx
│   │   ├── MyStories.tsx
│   │   ├── Setup.tsx
│   │   └── Story.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── supabase.ts
├── package.json
└── vite.config.ts
```

## Story Generation

Each request includes the story's genre, protagonist, world, tone, previous scenes, and latest user choice. The backend instructs Claude to generate 3 to 5 paragraphs, end at a decision point, and return exactly three distinct choices in a structured JSON response.
