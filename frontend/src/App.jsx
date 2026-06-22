import React, { useState, useEffect } from 'react';

export default function App() {
  // Estados de Controle de Tela
  const [tela, setTela] = useState('login'); // 'login', 'cadastro', 'dashboard'
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [erroAuth, setErroAuth] = useState('');

  // Estados do Form de Login/Cadastro
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');

  // Estados do Dashboard de Itens
  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('lista de compras');
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (tela === 'dashboard') {
      buscarItens();
    }
  }, [tela]);

  // Funções de Autenticação
  const lidarComCadastro = (e) => {
    e.preventDefault();
    setErroAuth('');
    
    fetch('http://localhost:5001/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: inputUser, senha: inputPass })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Cadastro realizado! Agora faça o seu login.');
      setTela('login');
      setInputPass('');
    })
    .catch(err => setErroAuth(err.message));
  };

  const lidarComLogin = (e) => {
    e.preventDefault();
    setErroAuth('');

    fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: inputUser, senha: inputPass })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsuarioLogado(data.usuario);
      setTela('dashboard');
    })
    .catch(err => setErroAuth(err.message));
  };

  const fazerLogout = () => {
    setUsuarioLogado(null);
    setInputUser('');
    setInputPass('');
    setTela('login');
  };

  // Funções de Gerenciamento de Itens
  const buscarItens = () => {
    fetch('http://localhost:5001/itens')
      .then(res => res.json())
      .then(data => setItens(data))
      .catch(err => console.error("Erro ao buscar dados:", err));
  };

  const adicionarItem = (e) => {
    e.preventDefault();
    if (!nome) return;

    fetch('http://localhost:5001/itens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, tipo, quantidade })
    })
    .then(() => {
      setNome('');
      setQuantidade(1);
      buscarItens();
    });
  };

  const deletarItem = (id) => {
    fetch(`http://localhost:5001/itens/${id}`, { method: 'DELETE' })
      .then(() => buscarItens());
  };

  // ==================== RENDERIZAÇÃO DE TELAS ====================

  if (tela === 'login' || tela === 'cadastro') {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <img src="/logo.png" alt="SkillForge" style={styles.authLogo} onError={(e)=>e.target.style.display='none'}/>
          <h1 style={styles.authTitle}>SKILL<span style={styles.brandPurple}>FORGE</span></h1>
          <p style={styles.authSubtitle}>{tela === 'login' ? 'Acesse o Painel de Controle' : 'Crie sua Conta de Acesso'}</p>

          {erroAuth && <div style={styles.errorAlert}>⚠️ {erroAuth}</div>}

          <form onSubmit={tela === 'login' ? lidarComLogin : lidarComCadastro} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Usuário</label>
              <input 
                type="text" 
                required
                placeholder="Digite seu usuário..." 
                value={inputUser} 
                onChange={(e) => setInputUser(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Senha</label>
              <input 
                type="password" 
                required
                placeholder="Digite sua senha..." 
                value={inputPass} 
                onChange={(e) => setInputPass(e.target.value)}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              {tela === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
            </button>
          </form>

          <div style={styles.authFooter}>
            {tela === 'login' ? (
              <p>Não tem conta? <span style={styles.link} onClick={() => {setTela('cadastro'); setErroAuth('');}}>Cadastre-se</span></p>
            ) : (
              <p>Já tem uma conta? <span style={styles.link} onClick={() => {setTela('login'); setErroAuth('');}}>Fazer Login</span></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tela principal (Dashboard)
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="SkillForge Logo" style={styles.logoImg} onError={(e)=>e.target.style.display='none'}/>
          <h1 style={styles.brandTitle}>SKILL<span style={styles.brandPurple}>FORGE</span></h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={styles.projectSubtitle}>👤 {usuarioLogado}</div>
          <button onClick={fazerLogout} style={styles.logoutBtn}>Sair</button>
        </div>
      </header>

      <main style={styles.mainContent}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>📥 Cadastrar Novo Item</h2>
          <form onSubmit={adicionarItem} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome do Item</label>
              <input type="text" placeholder="Ex: Arroz, Monitor..." value={nome} onChange={(e) => setNome(e.target.value)} style={styles.input}/>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ ...styles.inputGroup, flex: 2 }}>
                <label style={styles.label}>Destino / Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.select}>
                  <option value="lista de compras">🛒 Lista de Compras</option>
                  <option value="lista de desejos">⭐ Lista de Desejos</option>
                </select>
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Qtd.</label>
                <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)} style={styles.input}/>
              </div>
            </div>
            <button type="submit" style={styles.button}>Adicionar ao Sistema</button>
          </form>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Inventário de Itens</h2>
          <div style={styles.listContainer}>
            {itens.length === 0 ? (
              <p style={styles.emptyText}>Nenhum item cadastrado no momento.</p>
            ) : (
              itens.map(item => (
                <div key={item.id} style={styles.listItem}>
                  <div style={styles.itemInfo}>
                    <span style={item.tipo === 'lista de desejos' ? styles.tagDesejo : styles.tagCompra}>
                      {item.tipo === 'lista de desejos' ? 'DESEJO' : 'COMPRA'}
                    </span>
                    <span style={styles.itemName}>{item.nome}</span>
                    <span style={styles.itemQtd}>x{item.quantidade}</span>
                  </div>
                  <button onClick={() => deletarItem(item.id)} style={styles.deleteButton}>🗑️ Excluir</button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  authContainer: { backgroundColor: '#0a0b0d', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI', sans-serif", padding: '20px' },
  authCard: { backgroundColor: '#13151a', border: '1px solid #1f232b', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', textAlign: 'center' },
  authLogo: { height: '60px', marginBottom: '15px' },
  authTitle: { fontSize: '28px', fontWeight: '800', color: '#00d2ff', margin: '0 0 5px 0', letterSpacing: '1px' },
  authSubtitle: { color: '#a0aec0', fontSize: '14px', marginBottom: '25px' },
  errorAlert: { backgroundColor: 'rgba(252, 129, 129, 0.1)', border: '1px solid #fc8181', color: '#fc8181', borderRadius: '6px', padding: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'left' },
  authFooter: { marginTop: '25px', fontSize: '14px', color: '#a0aec0' },
  link: { color: '#00d2ff', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' },
  logoutBtn: { backgroundColor: '#1c1f26', border: '1px solid #2d3748', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  container: { backgroundColor: '#0a0b0d', color: '#e4e6eb', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", paddingBottom: '40px' },
  header: { backgroundColor: '#13151a', borderBottom: '2px solid #1f232b', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoImg: { height: '45px' },
  brandTitle: { fontSize: '24px', fontWeight: '800', color: '#00d2ff', margin: 0 },
  brandPurple: { color: '#9d4edd' },
  projectSubtitle: { backgroundColor: '#1f232b', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', color: '#a0aec0' },
  mainContent: { maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#13151a', borderRadius: '12px', border: '1px solid #1f232b', padding: '25px' },
  cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#fff', borderBottom: '1px solid #1f232b', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' },
  label: { fontSize: '11px', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase' },
  input: { backgroundColor: '#1c1f26', border: '1px solid #2d3748', borderRadius: '6px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' },
  select: { backgroundColor: '#1c1f26', border: '1px solid #2d3748', borderRadius: '6px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' },
  button: { background: 'linear-gradient(90deg, #00d2ff 0%, #9d4edd 100%)', color: '#fff', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(157, 78, 221, 0.3)' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  listItem: { backgroundColor: '#1c1f26', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #2d3748' },
  itemInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  itemName: { fontSize: '15px', color: '#fff' },
  itemQtd: { fontSize: '13px', color: '#a0aec0', backgroundColor: '#13151a', padding: '2px 8px', borderRadius: '4px' },
  tagCompra: { fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff' },
  tagDesejo: { fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(157, 78, 221, 0.15)', color: '#9d4edd' },
  deleteButton: { backgroundColor: 'transparent', border: '1px solid #fc8181', color: '#fc8181', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' },
  emptyText: { color: '#a0aec0', textAlign: 'center', fontSize: '14px', padding: '20px 0' }
};