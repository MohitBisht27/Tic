const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🎮 Tic-Tac-Toe Server is running on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});
