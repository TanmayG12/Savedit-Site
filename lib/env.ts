export function isProduction() {
  return process.env.VERCEL_ENV === "production";
}

export function getVercelEnv() {
  return process.env.VERCEL_ENV ?? "";
}