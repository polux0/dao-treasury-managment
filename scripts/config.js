const hre = require("hardhat");
const ethers = hre.ethers;

const provider = async function getProvider(){
    const provider = ethers.providers.getDefaultProvider("https://" + network() + ".infura.io/v3/" + process.env.INFURA_API_KEY);
    return provider;
}
const signer = async function getSigner() {
    const provider = provider()
    return ethers.Wallet.fromMnemonic(process.env.MNEMONIC, ["m/44'/60'/0'/0/1"]).connect(provider);
}
// module.exports = {
//     provider: provider,
//     signer: signer
// };