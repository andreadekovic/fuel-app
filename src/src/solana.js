import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export async function createProjectWallet() {
  const keypair = Keypair.generate();
  return {
    address: keypair.publicKey.toString(),
    privateKey: Array.from(keypair.secretKey),
  };
}

export function getConnection() {
  return connection;
}