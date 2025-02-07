export const BASE64 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export function uid() {
  let id = "";
  for (let i = 0; i < 24; i++) id += BASE64.charAt(Math.random() * 62);
  return id;
}