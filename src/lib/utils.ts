export const uid = () => {
  const bytes = [] as string[];
  for (let i = 0; i < 8; i++) {
    let r = Math.random();
    r += Date.now();
    r %= 255;

    bytes.push(r.toString(16));
  }

  return bytes.join("");
};
