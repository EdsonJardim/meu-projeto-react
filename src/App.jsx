import React, { useState, useEffect } from "react";
import "./App.css";

import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  getDocs
} from "firebase/firestore";

const PERSONAGENS_MARVEL = [
  {
    nome: "Homem de Ferro",
    imagemUrl: "https://nmarrrxcqkbkfwuzqcwo.supabase.co/storage/v1/object/public/imagens/Homem%20de%20Ferro.jpg",
    dataCadastro: Timestamp.now(),
  },
  {
    nome: "Capitão América",
    imagemUrl: "https://nmarrrxcqkbkfwuzqcwo.supabase.co/storage/v1/object/public/imagens/Capitao%20America.jpg",
    dataCadastro: Timestamp.now(),
  },
];

function Imagem() {
  return (
    <div>
      <img
        src="https://i.pinimg.com/736x/7d/58/f6/7d58f617c7a57407bc0e25c0fa780ad9.jpg"
        alt="educação"
        width="120"
      />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [personagens, setPersonagens] = useState([]);
  const [seedFeito, setSeedFeito] = useState(false);
  const [seedCarregando, setSeedCarregando] = useState(false);
  const [nomePersonagem, setNomePersonagem] = useState("");
  const [urlPersonagem, setUrlPersonagem] = useState("");
  const [editandoPersonagemId, setEditandoPersonagemId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "alunos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlunos(lista);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    async function buscarPersonagens() {
      const snapshot = await getDocs(collection(db, "personagens"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dataCadastro: doc.data().dataCadastro?.toDate().toLocaleDateString("pt-BR") ?? "—",
      }));
      setPersonagens(lista);
      if (lista.length > 0) setSeedFeito(true);
    }
    buscarPersonagens();
  }, [user]);

  async function cadastrar() {
    if (!email || !senha) { alert("Preencha email e senha!"); return; }
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Usuário cadastrado!");
    } catch (err) { alert(err.message); }
  }

  async function login() {
    if (!email || !senha) { alert("Preencha email e senha!"); return; }
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Logado!");
    } catch (err) { alert(err.message); }
  }

  async function logout() { await signOut(auth); }

  async function salvarAluno() {
    if (!nome || !curso) { alert("Preencha todos os campos!"); return; }
    try {
      if (editandoId) {
        await updateDoc(doc(db, "alunos", editandoId), { nome, curso });
        setEditandoId(null);
      } else {
        await addDoc(collection(db, "alunos"), { nome, curso });
      }
      setNome(""); setCurso("");
    } catch (err) { console.log(err); }
  }

  async function removerAluno(id) { await deleteDoc(doc(db, "alunos", id)); }

  function editarAluno(aluno) {
    setNome(aluno.nome); setCurso(aluno.curso); setEditandoId(aluno.id);
  }

  function cancelarEdicao() { setNome(""); setCurso(""); setEditandoId(null); }

  async function salvarPersonagem() {
    if (!nomePersonagem || !urlPersonagem) {
      alert("Preencha o nome e a URL da imagem!");
      return;
    }
    try {
      if (editandoPersonagemId) {
        await updateDoc(doc(db, "personagens", editandoPersonagemId), {
          nome: nomePersonagem,
          imagemUrl: urlPersonagem,
        });
        setPersonagens(prev =>
          prev.map(p =>
            p.id === editandoPersonagemId
              ? { ...p, nome: nomePersonagem, imagemUrl: urlPersonagem }
              : p
          )
        );
        setEditandoPersonagemId(null);
      } else {
        const docRef = await addDoc(collection(db, "personagens"), {
          nome: nomePersonagem,
          imagemUrl: urlPersonagem,
          dataCadastro: Timestamp.now(),
        });
        setPersonagens(prev => [...prev, {
          id: docRef.id,
          nome: nomePersonagem,
          imagemUrl: urlPersonagem,
          dataCadastro: new Date().toLocaleDateString("pt-BR"),
        }]);
        setSeedFeito(true);
      }
      setNomePersonagem("");
      setUrlPersonagem("");
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  }

  async function removerPersonagem(id) {
    await deleteDoc(doc(db, "personagens", id));
    setPersonagens(prev => prev.filter(p => p.id !== id));
  }

  function editarPersonagem(p) {
    setNomePersonagem(p.nome);
    setUrlPersonagem(p.imagemUrl);
    setEditandoPersonagemId(p.id);
  }

  function cancelarEdicaoPersonagem() {
    setNomePersonagem("");
    setUrlPersonagem("");
    setEditandoPersonagemId(null);
  }
  async function cadastrarPersonagens() {
    setSeedCarregando(true);
    try {
      const colecao = collection(db, "personagens");
      const novos = [];
      for (const p of PERSONAGENS_MARVEL) {
        const docRef = await addDoc(colecao, p);
        novos.push({
          id: docRef.id,
          ...p,
          dataCadastro: new Date().toLocaleDateString("pt-BR"),
        });
      }
      setPersonagens(novos);
      setSeedFeito(true);
      alert("✅ Personagens cadastrados no Firestore!");
    } catch (err) {
      alert("Erro ao cadastrar: " + err.message);
    } finally {
      setSeedCarregando(false);
    }
  }

  if (!user) {
    return (
      <div className="container">
        <h1>Login</h1>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
        <br /><br />
        <button onClick={login}>Login</button>
        <button onClick={cadastrar}>Cadastrar</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Sistema Acadêmico</h1>
      <button onClick={logout}>Logout</button>
      <Imagem />

      <h3>Lista de Alunos</h3>
      <ul>
        {alunos.map((aluno) => (
          <li key={aluno.id}>
            {aluno.nome} - {aluno.curso}
            <button onClick={() => editarAluno(aluno)}>Editar</button>
            <button onClick={() => removerAluno(aluno.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      <h3>{editandoId ? "Editar Aluno" : "Adicionar Aluno"}</h3>
      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input placeholder="Curso" value={curso} onChange={(e) => setCurso(e.target.value)} />
      <br /><br />
      <button onClick={salvarAluno}>{editandoId ? "Atualizar" : "Adicionar"}</button>
      {editandoId && <button onClick={cancelarEdicao}>Cancelar</button>}

      <hr style={{ margin: "32px 0" }} />
      <h2>Personagens Marvel</h2>

      {!seedFeito && (
        <button onClick={cadastrarPersonagens} disabled={seedCarregando}>
          {seedCarregando ? "Cadastrando..." : "📥 Cadastrar personagens no Firestore"}
        </button>
      )}

      <h3>{editandoPersonagemId ? "✏️ Editar Personagem" : "➕ Adicionar Personagem"}</h3>
      <input
        placeholder="Nome do personagem"
        value={nomePersonagem}
        onChange={(e) => setNomePersonagem(e.target.value)}
      />
      <input
        placeholder="URL da imagem (Supabase)"
        value={urlPersonagem}
        onChange={(e) => setUrlPersonagem(e.target.value)}
        style={{ width: "360px" }}
      />
      <br /><br />
      <button onClick={salvarPersonagem}>
        {editandoPersonagemId ? "💾 Atualizar" : "➕ Adicionar"}
      </button>
      {editandoPersonagemId && (
        <button onClick={cancelarEdicaoPersonagem}>❌ Cancelar</button>
      )}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "24px" }}>
        {personagens.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              width: "250px",
              textAlign: "center",
              boxShadow: "2px 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={p.imagemUrl}
              alt={p.nome}
              style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "8px" }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=Sem+Imagem"; }}
            />
            <h3 style={{ margin: "10px 0 4px" }}>{p.nome}</h3>
            <p style={{ color: "#888", fontSize: "13px" }}>📅 {p.dataCadastro}</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
              <button onClick={() => editarPersonagem(p)}>✏️ Editar</button>
              <button onClick={() => removerPersonagem(p.id)}>🗑️ Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

