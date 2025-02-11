const cors = require("cors");
const express = require("express");

const app = express();
const porta = process.env.PORT || 3000;

// const allowedOrigins = ["http://localhost:4000"];
const allowedOrigins = ["https://fram-artesanatos-frontend.vercel.app"];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

const rotaProduto = require("./produto");
const rotaUsuario = require("./usuario");

app.use("/produto", rotaProduto);
app.use("/usuario", rotaUsuario);

app.get("/", (req, res) => {
  res.send("Backend está funcionando!");
});

app.listen(porta, () => {
  console.log(`Servidor funcionando na porta ${porta}`);
});

module.exports = app;