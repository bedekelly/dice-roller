import { useEffect, useRef, useState } from "preact/hooks";
import parseDice from "./parser";
import rollDice from "./roller";

export function App() {
  const [keys, setKeys] = useState<string[]>([]);
  const [rolls, setRolls] = useState<string[]>([]);

  const [watching, setWatching] = useState(false);
  const watchingRef = useRef(false);

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      if (event.key === "r") {
        watchingRef.current = true;
        setWatching(true);
        return;
      }

      if (!watchingRef.current) return;

      if (event.key === "Backspace") {
        setKeys((oldKeys) => oldKeys.slice(0, -1));
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        setKeys((oldKeys) => {
          const rollInput = parseDice(oldKeys);
          watchingRef.current = false;
          setWatching(false);
          if (rollInput) {
            const roll = `${rollDice(rollInput)}`;
            setRolls((oldRolls) => [
              `${rollInput} = ${roll}`,
              ...oldRolls.slice(0, 10),
            ]);
          }
          return [];
        });
      }
      setKeys((oldKeys) => [...oldKeys, event.key]);
    }

    function keyUp(event: KeyboardEvent) {
      if (event.key === "r") {
        watchingRef.current = false;
        setWatching(false);
        setKeys((latestKeys) => {
          console.log(latestKeys);
          return [];
        });
      }
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    return () => {
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
    };
  }, []);

  const diceToRoll = parseDice(keys);

  return (
    <main className="font-sans flex flex-col items-center content-center w-full">
      <h1 className="text-center font-bold text-5xl mt-10">
        {watching ? "Rolling: " : "Not rolling."}
        {diceToRoll}
      </h1>
      <ul className="flex list-none items-center flex-col text-2xl mt-10">
        {rolls.map((roll, i) => (
          <li
            className="first:text-4xl first:mb-3 first:text-white first:font-bold text-gray-200 last:text-xl"
            key={i}
          >
            {roll}
          </li>
        ))}
      </ul>
    </main>
  );
}
