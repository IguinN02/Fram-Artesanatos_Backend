const cors = require("cors");
const express = require("express");

const app = express();
const porta = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://fram-artesanatos-frontend.vercel.app",
  credentials: true,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

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