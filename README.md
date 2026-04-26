# Prova
# Sistema Acadêmico

Projeto desenvolvido com **React + Firebase**, com autenticação de usuários e gerenciamento de alunos.

---

## Funcionalidades

* Cadastro e login de usuários (Firebase Auth)
* Cadastro de alunos
* Edição de dados
* Exclusão de registros
* Atualização em tempo real (Firestore)
* Deploy online com Firebase Hosting

---

## Tecnologias utilizadas

* React (Vite)
* Firebase Authentication
* Firestore Database
* Firebase Hosting

---

## Acesso ao projeto

 https://db10edsonprova.web.app

---

## Como rodar o projeto

```bash
# Instalar dependências
npm install

# Rodar em ambiente de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Fazer deploy no Firebase
firebase deploy
```

---

## Estrutura básica

```
src/
 ├── components/
 ├── firebase.js
 ├── App.jsx
 └── main.jsx
```

---

## Configuração do Firebase

Crie um arquivo `firebase.js` com suas credenciais do Firebase:

```js
// Exemplo simplificado
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
};

const app = initializeApp(firebaseConfig);
```

---

## Observações

* O banco de dados (Firestore) é gerenciado diretamente pelo Firebase
* Não é necessário backend próprio
* Projeto desenvolvido para fins acadêmicos

---

## Autor

Edson Eduardo Soares Jardim

