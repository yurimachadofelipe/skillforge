-- Script de Criação do Banco de Dados para o SkillForge --

-- Criação da tabela de usuários para o sistema de Login
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
);

-- Criação da tabela de itens para o gerenciamento do Inventário (CRUD)
CREATE TABLE IF NOT EXISTS itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1
);

-- Dados opcionais para popular o banco inicialmente (Exemplos de Teste)
INSERT INTO itens (nome, tipo, quantidade) VALUES ('Monitor Gamer 24', 'lista de desejos', 1);
INSERT INTO itens (nome, tipo, quantidade) VALUES ('Teclado Mecânico', 'lista de desejos', 1);
INSERT INTO itens (nome, tipo, quantidade) VALUES ('Cabos HDMI', 'lista de compras', 5);