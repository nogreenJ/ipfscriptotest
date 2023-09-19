import { useState } from "react";
import './App.css';
import { NFTStorage, Blob } from 'nft.storage'
import $ from 'jquery';

function App() {
  var CryptoJS = require("crypto-js");

  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA5NUY4QjRhYmRCNWUwODQ3YzVjMzMwMTA3NTYxZTNCMmFDZEQzRjIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NTEyNzkxMzk0MywibmFtZSI6ImlwZnNjcmlwdG90ZXN0In0.5C9OzSwrXryNbFh2temNfjkAjqcrma93dNMZMt8jwro'
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  const [retornoAPI, setRetornoAPI] = useState("");

  const save = async () => {
    $("#insertHash").val('');
    //select algorithim from insertCripto
    const alg = $("#insertCripto").val();
    const key = $("#insertChave").val();
    //encrypt value of insertVal using algorithm + insertChave
    const val = $("#insertVal").val();
    let data = '';
    switch (alg) {
      case "1":
        data = CryptoJS.HmacSHA1(val, key);
        break;
      case "2":
        data = CryptoJS.HmacSHA256(val, key);
        break;
      case "3":
        data = CryptoJS.HmacMD5(val, key);
        break;
    }
    //create blob with data, then insert
    if (data) {
      const someData = new Blob([data])
      const cid = await client.storeBlob(someData);
      //put hash of file on insertHash
      $("#insertHash").val(cid);
    } else {
      alert('Erro, um ou mais campos não informados');
    }
  }

  const buscar = async () => {
    $("#getVal").val('');
    //get hash from getHash, and fetch
    //getCripto algorithm + getChave key decrypt
    const hash = $("#getHash").val();
    const alg = $("#getCripto").val();
    const key = $("#getChave").val();
    if (!hash) {
      alert('Erro, um ou mais campos não informados');
      return;
    }
    //set result to getVal
    $.get(
      'https://' + hash + '.ipfs.nftstorage.link/',
      (response) => {
        if (!response) {
          alert('Não encontrado');
        }
        let data = response;
        switch (alg) {
          case "1":
            data = CryptoJS.SHA1.decrypt(response, key);
            break;
          case "2":
            data = CryptoJS.SHA256.decrypt(response, key);
            break;
          case "3":
            data = CryptoJS.MD5.decrypt(response, key);
            break;
        }
        $("#getVal").val(data)
      }
    );
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
          <input id="insertChave" type="text" placeholder="Chave"></input>
          <button style={{ margin: 2 }} onClick={() => save()}>Inserir</button>
          <br />
          <input id="insertHash" style={{ width: 500, margin: 2 }} type="text" readOnly={true} placeholder="Hash"></input>
          <br />
          <textarea id="insertVal" rows="30" cols="50" ></textarea>
        </div>

        <div class="largefield child">
          <input id="getHash" style={{ width: 500, margin: 2 }} type="text" placeholder="Hash"></input>
          <br />
          <select id="getCripto" style={{ margin: 2 }}>
            <option value="0">Algoritmo</option>
            <option value="1">SHA-1</option>
            <option value="2">SHA-256</option>
            <option value="3">MD5</option>
          </select>
          <input id="getChave" type="text" placeholder="Chave"></input>
          <button style={{ margin: 2 }} onClick={() => buscar()}>Buscar</button>
          <br />
          <textarea id="getVal" rows="30" cols="50" readOnly={true}></textarea>
        </div>

      </div>
    </div>
  );
}

export default App;
