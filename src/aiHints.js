// Simulated Copilot-style dynamic hint system.
// Expand the rules or generate hints from real AI later.

export function generateHint(state) {
  const { score, lives, elapsed, difficulty } = state;
  const hints = [];

  if (score < 5) {
    hints.push("Collect green tokens to raise score quickly.");
  } else if (score < 15) {
    hints.push("Try chaining pickups; stay near cluster spawns.");
  } else {
    hints.push("High score! Consider adding speed scaling in code.");
  }

  if (lives === 1) {
    hints.push("Critical life: play evasively; avoid chasing far tokens.");
  } else if (lives === 3 && elapsed < 20) {
    hints.push("You have full lives; be aggressive early.");
  }

  if (elapsed > 30 && difficulty < 2) {
    hints.push("Game feels easy? Increase difficulty ramp in updateDifficulty().");
  }

  // Meta suggestions encouraging Copilot usage
  hints.push(
    "Idea: Add power-ups granting temporary invulnerability. Ask Copilot to scaffold a PowerUp class.",
  );
  hints.push(
    "Refactor: Extract collision logic into a separate module. Prompt Copilot for clean interfaces.",
  );
  hints.push(
    "Polish: Implement particle effects on pickups. Copilot can help generate a lightweight system.",
  );

  return randomJoin(hints, 2 + Math.min(2, Math.floor(score / 15)));
}

function randomJoin(arr, count) {
  const copy = [...arr];
  const picked = [];
  while (copy.length && picked.length < count) {
    const i = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(i, 1)[0]);
  }
  return picked.join("\n\n");
}
