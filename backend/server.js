const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Banco de dados temporário em memória
let usuarios = [];
let itens = [];

// Rotas de Autenticação
app.post('/cadastro', (req, res) => {
  const { usuario, senha } = req.body;
  
  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  const usuarioExiste = usuarios.find(u => u.usuario === usuario);
  if (usuarioExiste) {
    return res.status(400).json({ error: 'Este usuário já existe!' });
  }

  usuarios.push({ usuario, senha });
  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  
  const conta = usuarios.find(u => u.usuario === usuario && u.senha === senha);
  if (!conta) {
    return res.status(400).json({ error: 'Usuário ou senha incorretos!' });
  }

  res.json({ message: 'Login efetuado!', usuario: conta.usuario });
});

// Rotas de Itens do Dashboard
app.get('/itens', (req, res) => {
  res.json(itens);
});

app.post('/itens', (req, res) => {
  const nuevoItem = {
    id: Date.now(),
    nome: req.body.nome,
    tipo: req.body.tipo || 'lista de compras',
    quantidade: parseInt(req.body.quantidade) || 1
  };
  itens.push(nuevoItem);
  res.status(201).json(nuevoItem);
});

app.delete('/itens/:id', (req, res) => {
  const { id } = req.params;
  itens = itens.filter(item => item.id !== parseInt(id));
  res.json({ message: "Item removido com sucesso!" });
});

// Inicialização na porta 5001
app.listen(5001, () => {
  console.log('🐒 Backend rodando com login na porta 5001!');
});