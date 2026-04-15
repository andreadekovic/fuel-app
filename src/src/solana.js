export async function createProjectWallet() {
  const { Keypair } = await import("@solana/web3.js");
  const keypair = Keypair.generate();
  return {
    address: keypair.publicKey.toString(),
    privateKey: Array.from(keypair.secretKey),
  };
}