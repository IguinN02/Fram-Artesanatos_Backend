const express = require("express");
const cors = require("cors");
const rotaProduto = require("./produto");
const rotaUsuario = require("./usuario");

const app = express();
const porta = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

console.log("Configuração de rota produto: ", rotaProduto);
console.log("Configuração de rota usuário: ", rotaUsuario);

app.use("/produto", rotaProduto);
app.use("/usuario", rotaUsuario);

app.get("/", (req, res) => {
  console.log("Rota raiz acessada");
  res.send("Backend está funcionando!");
});

app.listen(porta, () => {
  console.log(`Servidor funcionando na porta ${porta}`);
});

module.exports = app;