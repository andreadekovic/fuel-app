export async function createProjectWallet() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
  const random = (len) => Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return {
    address: random(44),
    privateKey: Array.from({length: 64}, () => Math.floor(Math.random() * 256)),
  };
}