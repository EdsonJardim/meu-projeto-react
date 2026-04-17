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
  updateDoc
} from "firebase/firestore";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "alunos"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlunos(lista);
    });

    return () => unsubscribe();
  }, [user]);

  async function cadastrar() {
    if (!email || !senha) {
      alert("Preencha email e senha!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Usuário cadastrado!");
    } catch (err) {
      alert(err.message);
    }
  }

  async function login() {
    if (!email || !senha) {
      alert("Preencha email e senha!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Logado!");
    } catch (err) {
      alert(err.message);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function salvarAluno() {
    if (!nome || !curso) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (editandoId) {
        await updateDoc(doc(db, "alunos", editandoId), {
          nome,
          curso
        });
        setEditandoId(null);
      } else {
        await addDoc(collection(db, "alunos"), {
          nome,
          curso
        });
      }

      setNome("");
      setCurso("");
    } catch (err) {
      console.log(err);
    }
  }

  async function removerAluno(id) {
    await deleteDoc(doc(db, "alunos", id));
  }

  function editarAluno(aluno) {
    setNome(aluno.nome);
    setCurso(aluno.curso);
    setEditandoId(aluno.id);
  }

  function cancelarEdicao() {
    setNome("");
    setCurso("");
    setEditandoId(null);
  }

  if (!user) {
    return (
      <div className="container">
        <h1>Login</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setSenha(e.target.value)}
        />

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

            <button onClick={() => editarAluno(aluno)}>
              Editar
            </button>

            <button onClick={() => removerAluno(aluno.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <h3>{editandoId ? "Editar Aluno" : "Adicionar Aluno"}</h3>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Curso"
        value={curso}
        onChange={(e) => setCurso(e.target.value)}
      />

      <br /><br />

      <button onClick={salvarAluno}>
        {editandoId ? "Atualizar" : "Adicionar"}
      </button>

      {editandoId && (
        <button onClick={cancelarEdicao}>
          Cancelar
        </button>
      )}
    </div>
  );
}

export default App;

