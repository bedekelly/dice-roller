function rollDie(type: number) {
  return Math.floor(Math.random() * type) + 1;
}

export default function rollDice(spec: string): [number, number[]] {
  let dice = spec.split("+");
  dice = dice.map((d) => d.trim());

  let total = 0;
  let individuals: number[] = [];

  for (let d of dice) {
    let [number, type] = d.split("d").map((val) => parseInt(val, 10));
    if (number > 99) [type, number] = [number, type];
    for (let i = 0; i < number; i++) {
      const individual = rollDie(type);
      if (type <= 100) individuals.push(individual);
      total += individual;
    }
  }

  return [total, individuals];
}
