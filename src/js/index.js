const ipfsGateways = [
  "https://cloudflare-ipfs.com/ipfs/",
  "https://gateway.ipfs.io/ipfs/",
];

async function handleCheck() {
  const link = document.querySelector(".link-input").value;
  // const link =
  //   "https://opensea.io/assets/0xce141c45619e9adbdbdda5af19b3052ff79d5663/147";
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
    setLoading(true);

    try {
      contract.methods
        .tokenURI(id)
        .call()
        .then((res) => {
          // console.log(res);
          setLoading(false);
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          alert("please try it later QAQ");
          reject();
        });
    } catch (error) {
      setLoading(false);
      alert("please try it later QQ");
    }
  });
}

function getMetaData(tokenURI) {
  let uri = tokenURI;
  if (tokenURI.startsWith("ipfs://")) {
    uri = `${ipfsGateways[0]}${tokenURI.replace("ipfs://", "")}`;
  }

  return new Promise((resolve, reject) => {
    setLoading(true);
    fetch(uri)
      .then((fetchData) => {
        return fetchData.json();
      })
      .then((result) => {
        // console.log(result.image);
        setLoading(false);
        resolve(result);
      })
      .catch((err) => {
        setLoading(false);
        alert("please try it later Q_Q");
        reject();
      });
  });
}

function renderImage(imageURI) {
  resetImage();

  let uri = imageURI;
  if (imageURI.startsWith("ipfs://")) {
    uri = `${ipfsGateways[0]}${imageURI.replace("ipfs://", "")}`;
  }

  const img = document.createElement("img");
  img.src = uri;
  document.querySelector(".image-section").appendChild(img);
}

function resetImage() {
  if (!document.querySelector(".image-section").firstChild) return;
  document
    .querySelector(".image-section")
    .removeChild(document.querySelector(".image-section").firstChild);
}

function setLoading(flag) {
  if (flag) {
    document.querySelector(".loading").style.display = "flex";
  } else {
    document.querySelector(".loading").style.display = "none";
  }
}

document.querySelector(".check-btn").addEventListener("click", handleCheck);
