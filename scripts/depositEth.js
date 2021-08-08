const { Interface } = require("ethers/lib/utils");
const { Wallet } = require("ethers/lib/")
const dotenv = require('dotenv');
dotenv.config();
const hre = require("hardhat");
const ethers = hre.ethers;
const treasuryABI = require("../artifacts/contracts/Treasury.sol/Treasury.json").abi


async function getProvider(){
    //return ethers.providers.getDefaultProvider("https://" + process.env.HARDHAT_NETWORK + ".infura.io/v3/" + process.env.INFURA_API_KEY);
    return ethers.providers.getDefaultProvider(`https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);
}
async function getSigner() {
    const path = "m/44'/60'/0'/0/1";
    return ethers.Wallet.fromMnemonic(process.env.MNEMONIC, path).connect(await getProvider());
}
// async function getTreasuryContract(){
//     const treasuryContract = new ethers.Contract("0x5cbdb1Bbc89492D20409b135C1E9DB3BC8eA0301", treasuryABI, signer)
// }

async function testDeposit() {

    // const Treasury = await hre.ethers.getContractFactory("Treasury");
    
    // const treasury = Treasury.attach("0xBE495B5B1cF3BD68e3829E84397b804f1dcfd6ff");

    const treasuryInterface = new Interface(treasuryABI);
    
    const data = treasuryInterface.encodeFunctionData("deposit");
    
    const signer = await getSigner();
    
    // console.log("signer: ", signer);

    const treasuryContract = new ethers.Contract("0x851740184C121D9352E925D59AaF38dF4b7fFa2b", treasuryABI, signer)

    // const gasLimit = await treasuryContract.estimateGas.deposit();
    
    const overrides = {
        value: ethers.utils.parseEther("0.00001"),
        gasLimit: 5000000,
        gasPrice: ethers.utils.parseUnits('6', 'gwei').toHexString() 
    };

    const result = await treasuryContract.deposit(overrides);

    console.log("Treasury.deposit() results: ", result);

  }

testDeposit()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});