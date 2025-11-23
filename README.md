# Copilot Demo Game

A minimal JavaScript canvas game intended to demonstrate how GitHub Copilot can help iterate on mechanics, refactor code, and add new features quickly.

## Concept
You control a blue circle collecting green pickups while avoiding red hazards. Difficulty ramps over time. A simulated "Copilot AI" hint panel suggests improvements based on game state and offers meta prompts you can actually feed to Copilot.

## Tech Stack
- Vanilla JS modules
- Canvas 2D rendering
- Vite for dev server & bundling

## File Overview
- `index.html` – Layout, canvas, HUD, hint panel.
- `src/styles.css` – Styling for game + side panel.
- `src/game.js` – Core loop, input, entities, collision logic.
- `src/aiHints.js` – Simulated dynamic hint generation.
- `package.json` – Vite scripts.

## Run Locally
```bash
npm install
npm run dev
```
Open the printed local URL (usually http://localhost:5173).

## Useful Copilot Prompt Ideas
Try typing comments or starting function stubs, then invoke Copilot for suggestions:
1. "Add power-up entities granting shields for 5 seconds".
2. "Implement particle effects on pickup collection".
3. "Refactor hazard update logic into a class with acceleration".
4. "Persist high score to localStorage and show on HUD".
5. "Add mobile touch controls (virtual joystick)".

## Extension Ideas
- Difficulty curve with adaptive spawns.
- Sound effects (Web Audio API).
- Accessibility mode: larger contrast, font scaling.
- Leaderboard backed by a small server / API.
- Real AI integration: replace `generateHint()` with API call.

## Next Steps
Open `src/game.js`, add a new feature stub in comments, ask Copilot to complete it. Iterate and compare suggestions.

## License
No license specified – for demo / internal use.
