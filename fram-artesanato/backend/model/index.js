const express = require("express");
const cors = require("cors");
const rotaProduto = require("./produto");
const usuarioRouter = require("./usuario");

const app = express();
const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`Servidor funcionando em http://localhost:${porta}`);
});

app.use(cors());
app.use(express.json());

console.log("Configuração de rota produto: ", rotaProduto);

app.use("/produto", rotaProduto);
app.use("/usuario", usuarioRouter);

app.get("/", (req, res) => {
  console.log("Rota raiz acessada");
  res.send("Backend está funcionando!");
});

module.exports = app;