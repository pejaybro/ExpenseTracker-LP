import crypto from "crypto";
export const generateDataHash = data => {
  // 1. Convert the object to a stable JSON string.
  // We use JSON.stringify with replacer/space to ensure consistent key ordering.
  const dataString = JSON.stringify(data, Object.keys(data).sort());
  // 2. Generate a cryptographic hash (MD5 is fine for data comparison)
  const hash = crypto.createHash("md5").update(dataString).digest("hex");

  return hash;
};
