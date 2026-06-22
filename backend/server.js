const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Banco de Dados SQLite (Cria o arquivo database.db automaticamente)
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar ao SQLite:', err.message);
  else console.log('💾 Banco de Dados SQLite conectado com sucesso!');
});

// Criar as tabelas no banco de dados se elas não existirem (Script de Criação Automática)
db.serialize(() => {
  // Tabela de Usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

  // Tabela de Itens (CRUD)
  db.run(`
    CREATE TABLE IF NOT EXISTS itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 1
    )
  `);
});

// ==================== ROTAS DE AUTENTICAÇÃO ====================

app.post('/cadastro', (req, res) => {
  const { usuario, senha } = req.body;
  
  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  const query = `INSERT INTO usuarios (usuario, senha) VALUES (?, ?)`;
  db.run(query, [usuario, senha], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Este usuário já existe!' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  });
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  
  const query = `SELECT * FROM usuarios WHERE usuario = ? AND senha = ?`;
  db.get(query, [usuario, senha], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(400).json({ error: 'Usuário ou senha incorretos!' });
    
    res.json({ message: 'Login efetuado!', usuario: row.usuario });
  });
});

// ==================== ROTAS DO CRUD DE ITENS ====================

// 1. READ (Buscar todos os itens)
app.get('/itens', (req, res) => {
  db.all(`SELECT * FROM itens`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. CREATE (Adicionar novo item)
app.post('/itens', (req, res) => {
  const { nome, tipo, quantidade } = req.body;
  const itemTipo = tipo || 'lista de compras';
  const itemQtd = parseInt(quantidade) || 1;

  const query = `INSERT INTO itens (nome, tipo, quantidade) VALUES (?, ?, ?)`;
  db.run(query, [nome, itemTipo, itemQtd], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, nome, tipo: itemTipo, quantidade: itemQtd });
  });
});

// 3. UPDATE (Editar a quantidade de um item)
app.put('/itens/:id', (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;
  const itemQtd = parseInt(quantidade) || 1;

  const query = `UPDATE itens SET quantidade = ? WHERE id = ?`;
  db.run(query, [itemQtd, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Item não encontrado!' });
    res.json({ message: "Quantidade atualizada com sucesso!" });
  });
});

// 4. DELETE (Excluir item)
app.delete('/itens/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM itens WHERE id = ?`;
  db.run(query, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Item não encontrado!' });
    res.json({ message: "Item removido com sucesso!" });
  });
});

// Inicialização na porta 5001
app.listen(5001, () => {
  console.log('🐒 Backend rodando com BANCO DE DADOS REAL na porta 5001!');
});