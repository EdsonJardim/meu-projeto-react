import React, { useState, useEffect } from "react";
import "./App.css";

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
  const [alunos, setAlunos] = useState([
    { nome: "Edson", curso: "ADS" },
    { nome: "Marcela", curso: "Engenharia" },
    { nome: "Daniela", curso: "Medicina" },
    { nome: "Felipe", curso: "Direito" }
  ]);

  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    console.log("Sistema Acadêmico iniciado");
  }, []);

  function salvarAluno() {
    if (!nome || !curso) return;

    if (editIndex !== null) {
      const listaAtualizada = [...alunos];
      listaAtualizada[editIndex] = { nome, curso };
      setAlunos(listaAtualizada);
      setEditIndex(null);
    } else {
      setAlunos([...alunos, { nome, curso }]);
    }

    setNome("");
    setCurso("");
  }

  function editarAluno(index) {
    setNome(alunos[index].nome);
    setCurso(alunos[index].curso);
    setEditIndex(index);
  }

  function cancelarEdicao() {
    setNome("");
    setCurso("");
    setEditIndex(null);
  }

  function removerAluno(index) {
    const novaLista = alunos.filter((_, i) => i !== index);
    setAlunos(novaLista);
  }

  return (
    <div className="container">
      <h1>Sistema Acadêmico</h1>

      {/* 👇 Aqui a imagem */}
      <Imagem />

      <h3>Lista de Alunos</h3>

      <ul>
        {alunos.map((aluno, i) => (
          <li key={i}>
            <span>
              {aluno.nome} - {aluno.curso}
            </span>

            <div>
              <button className="btn-edit" onClick={() => editarAluno(i)}>
                Editar
              </button>
              <button className="btn-delete" onClick={() => removerAluno(i)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3>{editIndex !== null ? "Editar Aluno" : "Adicionar Aluno"}</h3>

      <div>
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
      </div>

      <br />

      <button className="btn-primary" onClick={salvarAluno}>
        {editIndex !== null ? "Atualizar" : "Adicionar"}
      </button>

      {editIndex !== null && (
        <button className="btn-cancel" onClick={cancelarEdicao}>
          Cancelar
        </button>
      )}
    </div>
  );
}

export default App;

