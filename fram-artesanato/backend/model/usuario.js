const express = require("express");
const db = require("./conexao");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const usuarioRouter = express.Router();

// Registro de usuário
usuarioRouter.post("/register", async (req, res) => {
    const { nome, email, telefone, password } = req.body;

    if (!nome || !email || !telefone || !password) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    try {
        // Verifica se o email já está cadastrado
        const existingUser = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email já cadastrado" });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir novo usuário
        const result = await db.query(
            "INSERT INTO usuarios (nome, email, telefone, password) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone",
            [nome, email, telefone, hashedPassword]
        );

        res.status(201).json({ message: "Usuário registrado com sucesso", user: result.rows[0] });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Login de usuário
usuarioRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
        const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        const user = result.rows[0];

        // Verifica a senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        // Gera token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone } });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = usuarioRouter;