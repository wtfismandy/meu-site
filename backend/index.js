require('dotenv').config();const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Criação da tabela
const criarTabela = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id SERIAL PRIMARY KEY,
        texto TEXT NOT NULL
      );
    `);
    console.log('Tabela mensagens verificada/criada!');
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
  }
};

criarTabela();

// Rotas
app.get('/dados', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM mensagens');
    res.json(resultado.rows);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

app.post('/dados', async (req, res) => {
  const { texto } = req.body;
  try {
    await pool.query('INSERT INTO mensagens (texto) VALUES ($1)', [texto]);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

app.delete('/dados/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM mensagens WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando na porta 3000!');
});
