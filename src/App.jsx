import { useState } from "react";
import './App.css';

function App() {

  const [retornoAPI, setRetornoAPI] = useState("");

  const getOla = async () => {
    await fetch('http://localhost:3002/ola')
      .then(response => response.json())
      .then(json => setRetornoAPI(JSON.stringify(json)))
      .catch(err => console.log('erro: ' + err))
  }

  const pegaDados = async () => {
    await fetch('http://localhost:3002/ola',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "nome": "Jorge", "profissao": "Professor" })
      })
      .then(response => response.json())
      .then(json => setRetornoAPI(JSON.stringify(json)))
      .catch(err => console.log('erro: ' + err))
  }

  return (
    <div >
      <h1>Teste IPFS cripto</h1>
      <div class="container">
        <div class="largefield child">
          <select style={{ margin: 2 }}>
            <option value="0">Algoritmo</option>
            <option value="1">SHA-1</option>
            <option value="2">SHA-256</option>
            <option value="3">MD5</option>
          </select>
          <input type="text" readOnly="true" placeholder="Chave"></input>
          <button style={{ margin: 2 }} onClick={() => getOla()}>Inserir</button>
          <br />
          <input style={{ width: 500, margin: 2 }} type="text" readOnly="true" placeholder="Hash"></input>
          <br />
          <input class="lg-txt" type="text"></input>
        </div>
        <div class="largefield child">
          <input style={{ width: 500, margin: 2 }} type="text" readOnly="true" placeholder="Hash"></input>
          <br />
          <select style={{ margin: 2 }}>
            <option value="0">Algoritmo</option>
            <option value="1">SHA-1</option>
            <option value="2">SHA-256</option>
            <option value="3">MD5</option>
          </select>
          <input type="text" readOnly="true" placeholder="Chave"></input>
          <button style={{ margin: 2 }} onClick={() => getOla()}>Buscar</button>
          <br />
          <input class="lg-txt" type="text" readOnly="true"></input>
        </div>
      </div>
    </div>
  );
}

export default App;
