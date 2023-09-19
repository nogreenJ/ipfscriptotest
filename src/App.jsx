import { useState } from "react";
import './App.css';
import { NFTStorage, Blob } from 'nft.storage'

function App() {

  const NFT_STORAGE_TOKEN = 'your-api-token'
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  const [retornoAPI, setRetornoAPI] = useState("");

  const save = async () => {
    //select algorithim from insertCripto
    //encrypt value of insertVal using algorithm + insertChave
    //create blob with data, then insert
    const someData = new Blob(["hello world"])
    const cid = await client.storeBlob(someData);
    //put hash of file on insertHash
  }

  const buscar = async () => {
    //get hash from getHash, and fetch
    await fetch('http://')
      .then(response => response.json())
      .then(json => setRetornoAPI(JSON.stringify(json)))
      .catch(err => console.log('erro: ' + err));
    //getCripto algorithm + getChave key decrypt
    //set result to getVal
  }

  return (
    <div >
      <h1>Teste IPFS cripto</h1>
      <div class="container">

        <div class="largefield child">
          <select id="insertCripto" style={{ margin: 2 }}>
            <option value="0">Algoritmo</option>
            <option value="1">SHA-1</option>
            <option value="2">SHA-256</option>
            <option value="3">MD5</option>
          </select>
          <input id="insertChave" type="text" readOnly="true" placeholder="Chave"></input>
          <button style={{ margin: 2 }} onClick={() => save()}>Inserir</button>
          <br />
          <input id="insertHash" style={{ width: 500, margin: 2 }} type="text" readOnly="true" placeholder="Hash"></input>
          <br />
          <textarea id="insertVal" class="lg-txt" rows="30" cols="50" ></textarea>
        </div>

        <div class="largefield child">
          <input id="getHash" style={{ width: 500, margin: 2 }} type="text" readOnly="true" placeholder="Hash"></input>
          <br />
          <select id="getCripto" style={{ margin: 2 }}>
            <option value="0">Algoritmo</option>
            <option value="1">SHA-1</option>
            <option value="2">SHA-256</option>
            <option value="3">MD5</option>
          </select>
          <input id="getChave" type="text" readOnly="true" placeholder="Chave"></input>
          <button style={{ margin: 2 }} onClick={() => buscar()}>Buscar</button>
          <br />
          <textarea id="getVal" class="lg-txt" rows="30" cols="50" readOnly="true"></textarea>
        </div>

      </div>
    </div>
  );
}

export default App;
