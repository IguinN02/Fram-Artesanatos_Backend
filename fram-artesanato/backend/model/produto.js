const express = require("express");
const db = require("./conexao");
const produtoRouter = express.Router();

const handleQuery = (res, query, params, successCallback) => {
  db.query(query, params)
    .then((results) => successCallback(results))
    .catch((err) => {
      console.error("Erro na consulta:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
};

const validateProductFields = (req, res, next) => {
  const { NomeProduto, ValorProduto, DescricaoProduto, ImgProduto } = req.body;
  if (!NomeProduto || !ValorProduto || !DescricaoProduto || !ImgProduto) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }
  next();
};

produtoRouter.get("/", (req, res) => {
  console.log("Consultando todos os produtos...");
  handleQuery(res, "SELECT * FROM produto", [], (results) => res.json(results.rows));
});

produtoRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  handleQuery(
    res,
    "SELECT * FROM produto WHERE idproduto = $1",
    [id],
    (results) => {
      if (results.rows.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      res.json(results.rows[0]);
    }
  );
});

produtoRouter.post("/", validateProductFields, (req, res) => {
  const { NomeProduto, ValorProduto, DescricaoProduto, ImgProduto } = req.body;
  const sql =
    "INSERT INTO produto (nome, preco, descricao, imagens) VALUES ($1, $2, $3, $4) RETURNING idproduto";
  const values = [NomeProduto, ValorProduto, DescricaoProduto, ImgProduto];

  handleQuery(res, sql, values, (results) =>
    res.status(201).json({
      message: "Produto criado com sucesso",
      id: results.rows[0].idproduto,
    })
  );
});

produtoRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const { NomeProduto, ValorProduto, DescricaoProduto, ImgProduto } = req.body;

  let updateFields = [];
  let values = [];
  let paramIndex = 1;

  if (NomeProduto) {
    updateFields.push(`nome = $${paramIndex}`);
    values.push(NomeProduto);
    paramIndex++;
  }
  if (ValorProduto) {
    updateFields.push(`preco = $${paramIndex}`);
    values.push(ValorProduto);
    paramIndex++;
  }
  if (DescricaoProduto) {
    updateFields.push(`descricao = $${paramIndex}`);
    values.push(DescricaoProduto);
    paramIndex++;
  }
  if (ImgProduto) {
    updateFields.push(`imagens = $${paramIndex}`);
    values.push(ImgProduto);
    paramIndex++;
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "Nenhum campo a ser atualizado" });
  }

  values.push(id);
  const sql = `UPDATE produto SET ${updateFields.join(", ")} WHERE idproduto = $${paramIndex}`;

  handleQuery(res, sql, values, (result) => {
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(200).json({ message: "Produto atualizado com sucesso" });
  });
});

produtoRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM produto WHERE idproduto = $1";

  handleQuery(res, sql, [id], (result) => {
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(200).json({ message: "Produto apagado com sucesso" });
  });
});

produtoRouter.get("/search/:query", (req, res) => {
  const searchQuery = `%${req.params.query}%`;
  
  handleQuery(
    res,
    "SELECT * FROM produto WHERE nome ILIKE $1",
    [searchQuery],
    (results) => res.json(results.rows)
  );
});

module.exports = produtoRouter;