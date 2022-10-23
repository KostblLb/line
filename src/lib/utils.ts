export const getRandom = () => Math.random(); // wrap for testing

export const uid = () => {
  const bytes = [] as string[];
  for (let i = 0; i < 8; i++) {
    let r = getRandom() * 100500;
    r += Date.now();
    r %= 255;
    r = r >> 0;

    bytes.push(r.toString(16));
  }

  return bytes.join("-");
};
