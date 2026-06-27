import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const contractPath = path.join(rootDir, 'contracts', 'FunProRegistry.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'FunProRegistry.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

console.log('Compiling contract...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
  const hasError = output.errors.some(e => e.severity === 'error');
  if (hasError) process.exit(1);
}

const contractFile = output.contracts['FunProRegistry.sol'];
const contract = contractFile['FunProRegistry'];

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

console.log('Contract compiled successfully.');

// Write ABI
const abiPath = path.join(rootDir, 'src', 'lib', 'FunProRegistry.abi.json');
fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
console.log('ABI saved to', abiPath);

// Deploy
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
if (!privateKey) {
  console.error('DEPLOYER_PRIVATE_KEY not found in .env');
  process.exit(1);
}

const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);
const client = createWalletClient({
  account,
  chain: base,
  transport: http(),
}).extend(publicActions);

async function deploy() {
  console.log(`Deploying with account: ${account.address}`);
  
  const hash = await client.deployContract({
    abi,
    bytecode: `0x${bytecode}`,
  });
  
  console.log(`Transaction hash: ${hash}`);
  
  const receipt = await client.waitForTransactionReceipt({ hash });
  
  console.log(`Contract deployed at address: ${receipt.contractAddress}`);
  
  // Update .env with contract address
  const envPath = path.join(rootDir, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}`);
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${receipt.contractAddress}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log('.env updated with NEXT_PUBLIC_CONTRACT_ADDRESS');
}

deploy().catch(err => {
  console.error('Deployment failed:', err);
  process.exit(1);
});
