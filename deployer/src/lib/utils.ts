const MAX_ID_LENGTH = 5;

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function generateRandomId(length: number = MAX_ID_LENGTH) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}