const ipfsGateways = ["https://gateway.ipfs.io/ipfs/"];

async function handleCheck() {
  // const link = document.querySelector(".link-input").value;
  const link =
    "https://opensea.io/assets/0xed5af388653567af2f388e6224dc7c4b3241c544/2388";
  let sLink = link.split("/");
  const tokenId = sLink.pop();
  const contractAddress = sLink.pop();
  // console.log(contractAddress, tokenId);
  const tokenURI = await getTokenURI(contractAddress, tokenId);
  const metaData = await getMetaData(tokenURI);
  renderImage(metaData.image);
}

function getTokenURI(address, id) {
  const abi = [
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  // const web3 = new Web3(window.ethereum);
  const web3 = new Web3(
    Web3.givenProvider || "http://localhost:8543",
    null,
    {}
  );

  const contract = new web3.eth.Contract(abi, address);

  return new Promise((resolve, reject) => {
    contract.methods
      .tokenURI(id)
      .call()
      .then((res) => {
        // console.log(res);
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
}

function getMetaData(tokenURI) {
  return new Promise((resolve, reject) => {
    fetch(tokenURI)
      .then((fetchData) => {
        return fetchData.json();
      })
      .then((result) => {
        // console.log(result.image);
        resolve(result);
      });
  });
}

function renderImage(imageURI) {
  const img = document.createElement("img");
  img.src = imageURI;
  document.querySelector(".image-section").appendChild(img);
}

handleCheck();
