const allowedDice = [2, 4, 6, 8, 10, 12, 20, 100];

export function asNumber(numbers: number[]) {
  return numbers.reduce((acc, val, index, arr) => {
    return acc + val * 10 ** (arr.length - index - 1);
  }, 0);
}

function toDigit(key: string): number {
  if (key === "`" || key === "Tab" || key === "CapsLock" || key === "e") {
    return 0;
  }
  return parseInt(key, 10);
}

export default function parseDice(stringKeys: string[]): string | null {
  const keys = stringKeys.map(toDigit);

  if (keys.some((k) => isNaN(k))) return null;

  if (keys.length === 0) return null;
  if (keys.length === 1) {
    if (allowedDice.includes(keys[0])) {
      return `1d${keys[0]}`;
    }
    if (keys[0] === 0) return "1d10";
    return `${keys[0]}d`;
  }

  if (keys.length === 2) {
    const [first, second] = keys;

    // 00 = 1d100
    if (first === 0 && second === 0) {
      return "1d100";
    }

    // 10 = 1d10, 20 = 1d20 etc.
    for (const die of allowedDice) {
      if (first * 10 + second === die) {
        return `1d${die}`;
      }
    }

    // 22 = 2d2
    if (allowedDice.includes(second)) {
      return `${first}d${second}`;
    }

    if (second === 0) {
      return `${first}d10`;
    }

    // 21 = 2d10
    if (second === 1) {
      return `${first}d10`;
    }

    return `${first}${second}d`;
  }

  if (keys.length >= 3) {
    const [penultimate, ultimate] = keys.slice(-2);
    const rest = keys.slice(0, -2);

    if (`${penultimate}${ultimate}` === "00") {
      if (rest[rest.length - 1] === 1) {
        return `${asNumber(rest.slice(0, -1))}d100`;
      } else {
        return `${asNumber(rest)}d100`;
      }
    }

    const lastTwo = parseInt(`${penultimate}${ultimate}`, 10);
    if (penultimate !== 0 && allowedDice.includes(lastTwo)) {
      return `${asNumber(rest)}d${lastTwo}`;
    }

    if (ultimate === 0 || ultimate === 1) {
      return `${asNumber([...rest, penultimate])}d${10}`;
    }

    if (allowedDice.includes(ultimate)) {
      return `${asNumber([...rest, penultimate])}d${ultimate}`;
    }
  }

  return null;
}
