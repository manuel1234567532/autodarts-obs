let currentMatchId = null;
let pollingInterval = null;

function getMatchIdFromUrl() {
  const match = window.location.pathname.match(/\/matches\/([0-9a-f-]{36})/);
  return match ? match[1] : null;
}

function buildModeLabel(data) {
  const variant = data.variant || "X01";
  const baseScore = data.settings?.baseScore || 501;
  const outMode = data.settings?.outMode || "Straight";
  const inMode = data.settings?.inMode || "Straight";

  // z. B. "501 - Double Out"
  if (variant === "X01") {
    return `${baseScore} - ${outMode} Out`;
  }

  // Fallback: z. B. "Cricket", "Count-Up", etc.
  return variant;
}

async function startPolling(matchId) {
  if (pollingInterval) clearInterval(pollingInterval);
  currentMatchId = matchId;

  console.log("[Plugin] Starte neues Polling für Match:", matchId);

  pollingInterval = setInterval(async () => {
    try {
      const res = await fetch(`https://api.autodarts.io/gs/v0/matches/${matchId}/state`, {
        credentials: "include"
      });

      if (!res.ok) {
        console.warn("[Plugin] Fehler beim Abrufen von Matchdaten:", res.status);
        return;
      }

      const data = await res.json();

      const player1 = data.players[0]?.name || "Unknown";
      const player2 = data.players[1]?.name || "Unknown";
      const score1 = data.gameScores[0] ?? "N/A";
      const score2 = data.gameScores[1] ?? "N/A";
      const activePlayer = data.player;

      // Spielmodus extrahieren
      const mode = buildModeLabel(data);

      // Würfe
      let lastThrows = [];
      const currentTurn = data.turns.at(-1);
      if (currentTurn && Array.isArray(currentTurn.throws)) {
        lastThrows = currentTurn.throws.map(t => t.score).filter(n => typeof n === "number");
      }
      if (lastThrows.length === 0 && typeof data.turnScore === "number") {
        lastThrows = [data.turnScore];
      }

      const throws1 = activePlayer === 0 ? lastThrows : [];
      const throws2 = activePlayer === 1 ? lastThrows : [];

      console.log(`[Plugin] ${player1} (${score1}) vs ${player2} (${score2}) — ${activePlayer === 0 ? player1 : player2} wirft`);
      console.log("[Plugin] Würfe:", lastThrows);
      console.log("[Plugin] Modus:", mode);

      await fetch("http://localhost:3000/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player1,
          player2,
          score1,
          score2,
          player: activePlayer,
          throws1,
          throws2,
          mode // NEU: Spielmodus
        })
      });
    } catch (err) {
      console.error("[Plugin] Fehler im Polling:", err);
    }
  }, 500);
}

function observeMatchChanges() {
  let lastUrl = location.href;

  const observer = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      const newMatchId = getMatchIdFromUrl();

      if (newMatchId && newMatchId !== currentMatchId) {
        console.log("[Plugin] Neue Match-ID erkannt:", newMatchId);
        startPolling(newMatchId);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

(function init() {
  const matchId = getMatchIdFromUrl();
  if (matchId) {
    startPolling(matchId);
  } else {
    console.log("[Plugin] Noch keine gültige Match-ID gefunden.");
  }

  observeMatchChanges();
})();
