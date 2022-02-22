function rollDie(type: number) {
  return Math.floor(Math.random() * type) + 1;
}

export default function rollDice(spec: string) {
  let dice = spec.split("+");
  dice = dice.map((d) => d.trim());

  let total = 0;
  for (let d of dice) {
    const [number, type] = d.split("d").map((val) => parseInt(val, 10));
    for (let i = 0; i < number; i++) {
      total += rollDie(type);
    }
  }

  return total;
}
