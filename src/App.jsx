import './App.css';
import { createHelia } from 'helia'
import { strings } from '@helia/strings'
import { unixfs } from '@helia/unixfs'
import $ from 'jquery';
import { CID } from 'multiformats/cid';
import { useState, useCallback } from "react";
import { NFTStorage, Blob } from 'nft.storage'
import { useDropzone } from 'react-dropzone'
import Dropzone from 'react-dropzone'

const helia = await createHelia();
const s = strings(helia);
const fs = unixfs(helia);
const encoder = new TextEncoder()
var CryptoJS = require("crypto-js");

function App() {

  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA5NUY4QjRhYmRCNWUwODQ3YzVjMzMwMTA3NTYxZTNCMmFDZEQzRjIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NTEyNzkxMzk0MywibmFtZSI6ImlwZnNjcmlwdG90ZXN0In0.5C9OzSwrXryNbFh2temNfjkAjqcrma93dNMZMt8jwro'
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

  const [hashIn, setHashIn] = useState("");
  const [activeFile, setActiveFile] = useState({ nome: '', binary: '' });


  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
        setActiveFile({ nome: file.name, binary: binaryStr });
        console.log(activeFile)
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const save = async () => {
    $("#insertHash").val('');
    //select algorithim from insertCripto
    const alg = $("#insertCripto").val();
    const gate = $("#insertGateway").val();
    const key = $("#insertChave").val();
    //encrypt value of insertVal using algorithm + insertChave
    const val = activeFile.binary;
    if (!activeFile.binary) {
      alert('Insira um arquivo!')
      return;
    }
    setActiveFile({ nome: '', binary: '' });
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
      let cid = "";
      switch (gate) {
        //NFT.storage
        case "1":
          const someData = new Blob([data])
          cid = await client.storeBlob(someData);
          break;
        //AWS gateway
        case "2":
          alert("Not implemented")
          break;
        //Other
        case "3":
          alert("Not implemented")
          break;
        default:
          alert("No gateway")
          break;
      }
      $("#insertHash").val(cid);
      /*await s.add(data)
        .then((res) => {
          $("#insertHash").val(res);
        });*/
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
    let resp = '';
    for await (const chunk of fs.cat(CID.parse(hash))) {
      resp += /*decoder.decode(*/chunk/*, {
        stream: true
      })*/
    }
    $("#getVal").val(resp);
    /*await fs.get(CID.parse(hash))
      .then((res) => {
        if (alg === "1" && key) {
          res = CryptoJS.AES.decrypt(res, key);
          res = res.toString(CryptoJS.enc.Utf8);
          if (!res) {
            alert('Chave incorreta!');
            return;
          }
        }
        $("#getVal").val(res);
      }).catch(e => console.log(e));*/

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
          <select id="insertGateway" style={{ margin: 2 }}>
            <option value="0">Gateway</option>
            <option value="1">NFT.Storage</option>
            <option value="2">AWS Gateway</option>
            <option value="3">Pinata</option>
          </select>
          <input id="insertChave" type="text" placeholder="Chave"></input>
          <button style={{ margin: 2 }} onClick={() => save()}>Inserir</button>
          <br />
          <input id="insertHash" style={{ width: 500, margin: 2 }} type="text" readOnly={true} placeholder="Hash"></input>
          <br />

          <div {...getRootProps()}>
            <input class="dropFiles" {...getInputProps()} />
            {
              activeFile.nome ? activeFile.nome :
                isDragActive ?
                  <p>Soltar arquivos...</p> :
                  <p>Insira os arquivos aqui</p>
            }
          </div>
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
