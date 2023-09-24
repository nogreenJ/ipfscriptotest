import './App.css';
import { createHelia } from 'helia'
import { strings } from '@helia/strings'
import $ from 'jquery';
import { CID } from 'multiformats/cid';

const helia = await createHelia();
const s = strings(helia);
var CryptoJS = require("crypto-js");

function App() {

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
        data = CryptoJS.AES.encrypt(val, key).toString();
        break;
      case "2":
        data = CryptoJS.HmacSHA256(val, key).toString();
        break;
      case "3":
        data = CryptoJS.HmacMD5(val, key).toString();
        break;
      default: data = val;
    }
    if (data) {
      await s.add(data)
        .then((res) => {
          $("#insertHash").val(res);
        });
    } else {
      alert('Erro, um ou mais campos não informados');
    }
  }

  const buscar = async () => {
    $("#getVal").val('');
    const hash = $("#getHash").val();
    const alg = $("#getCripto").val();
    const key = $("#getChave").val();
    if (!hash) {
      alert('Erro, informe o CID');
      return;
    }
    await s.get(CID.parse(hash))
      .then((res) => {
        if (alg === "1" && key) {
          res = CryptoJS.AES.decrypt(res, key);
          res = res.toString(CryptoJS.enc.Utf8);
          if (!res)
            alert('Chave incorreta!');
        }
        $("#getVal").val(res);
      });

  }

  return (
    <div >
      <h1>Teste IPFS cripto</h1>
      <div class="container">

        <div class="largefield child">
          <select id="insertCripto" style={{ margin: 2 }}>
            <option value="0">Algoritmo</option>
            <option value="1">AES</option>
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
            <option value="0">Criptografia</option>
            <option value="1">AES</option>
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
