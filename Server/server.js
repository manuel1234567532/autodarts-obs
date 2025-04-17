const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Statische HTML-Dateien aus dem Ordner "public" bereitstellen
app.use(express.static(path.join(__dirname, "public")));

let matchData = {
  player1: "",
  player2: "",
  score1: 501,
  score2: 501,
  player: 0,
  throws1: [],
  throws2: [],
  mode: ""
};

app.post("/update", (req, res) => {
  matchData = req.body;
  res.sendStatus(200);
});

app.get("/overlay", (req, res) => {
  res.json(matchData);
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
