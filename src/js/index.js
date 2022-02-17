function handleCheck() {
  // const link = document.querySelector(".link-input").value;
  const link =
    "https://opensea.io/assets/0xed5af388653567af2f388e6224dc7c4b3241c544/2388";
  let sLink = link.split("/");
  const tokenId = sLink.pop();
  const contractAddress = sLink.pop();
  // console.log(contractAddress, tokenId);
  getTokenURI(contractAddress, tokenId);
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

  // const web3 = new Web3(new Web3.providers.HttpProvider());
  // await window.ethereum.enable();

  const contract = new web3.eth.Contract(abi, address);
  // console.log(contract);
  contract.methods
    .tokenURI(id)
    .call()
    .then((res) => {
      console.log(res);
      fetch(res)
        .then((fetchData) => {
          return fetchData.json();
        })
        .then((result) => {
          console.log(result.image);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

handleCheck();
