const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let score = 0;
let leaderboard = [];

app.post("/invest/safe", (req, res) => {
  score += 2;
  res.json({ score });
});

app.post("/invest/risk", (req, res) => {
  const win = Math.random() > 0.5;
  score += win ? 5 : -3;
  res.json({ score });
});

app.post("/leaderboard", (req, res) => {
  leaderboard.push(req.body.score);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 5);
  score = 0;
  res.sendStatus(200);
});

app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});