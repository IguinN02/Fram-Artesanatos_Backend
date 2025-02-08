const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./conexao");

const usuarioRouter = express.Router();
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const handleQuery = (res, query, params, successCallback) => {
  db.query(query, params)
    .then((results) => successCallback(results))
    .catch((err) => {
      console.error("Erro na consulta:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
};

usuarioRouter.get("/", (req, res) => {
  console.log("Consultando todos os usuarios...");
  handleQuery(res, "SELECT * FROM usuarios", [], (results) => res.json(results.rows));
});

usuarioRouter.post("/cadastro", async (req, res) => {
  const { nome, email, telefone, password } = req.body;

  if (!nome || !email || !telefone || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const senhaHash = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO usuarios (nome, email, telefone, password) VALUES ($1, $2, $3, $4) RETURNING id, email";
    const values = [nome, email, telefone, senhaHash];

    handleQuery(res, sql, values, (results) => {
      const usuario = results.rows[0];

      const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        id: usuario.id,
        token,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

usuarioRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  db.query("SELECT * FROM usuarios WHERE email = $1", [email])
    .then(async (results) => {
      if (results.rows.length === 0) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      const usuario = results.rows[0];
      const senhaValida = await bcrypt.compare(password, usuario.password);

      if (!senhaValida) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.json({ message: "Login bem-sucedido", token });
    })
    .catch((err) => {
      console.error("Erro no login:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
});

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "Token não fornecido" });
  }

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.usuarioId = decoded.id;
    next();
  });
};

usuarioRouter.get("/perfil", verificarToken, (req, res) => {
  db.query("SELECT id, nome, email, telefone FROM usuarios WHERE id = $1", [req.usuarioId])
    .then((results) => {
      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(results.rows[0]);
    })
    .catch((err) => {
      console.error("Erro ao buscar perfil:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
});

module.exports = usuarioRouter;