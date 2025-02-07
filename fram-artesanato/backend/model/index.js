const express = require("express");
const cors = require("cors");
const rotaProduto = require("./produto");
const rotaUsuario = require("./usuario");

const app = express();
const porta = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://fram-artesanatos-frontend.vercel.app", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type, Authorization", 
};

app.use(cors(corsOptions));
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
  console.log(`Servidor funcionando em http://localhost:${porta}`);
});

module.exports = app;