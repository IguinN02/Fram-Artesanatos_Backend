const cors = require("cors");
const express = require("express");

const app = express();
const porta = process.env.PORT || 3000;

const allowedOrigins = ["https://fram-artesanatos-frontend.vercel.app"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

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