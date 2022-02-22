import { useEffect, useRef, useState } from "preact/hooks";
import parseDice from "./parser";
import rollDice from "./roller";
import "./blink.css";

function Blinking() {
  return <div className="blink">_</div>;
}

function Roll({ children: roll }: { children: string }) {
  const [left, right] = roll.split("=");
  return (
    <div className="w-full flex">
      <div className="w-1/2 text-right">{left.trim()} = </div>
      <div className="w-1/2">&nbsp;{right.trim()}</div>
    </div>
  );
}

export function App() {
  const [keys, setKeys] = useState<string[]>([]);
  const [rolls, setRolls] = useState<string[]>([
    "1d8 = 10",
    "38d100 = 1000000",
    "2d2 =1",
  ]);

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
        {watching ? (
          <>
            {"Rolling: "}
            {diceToRoll}
            <Blinking />
          </>
        ) : (
          <div className="mt-3">
            Hold{" "}
            <kbd className="border border-gray-300 rounded-lg px-3 py-1">r</kbd>{" "}
            to roll.
          </div>
        )}
      </h1>
      {watching && (
        <p className="mt-8">
          Hit{" "}
          <kbd className="border border-gray-300 rounded-lg px-3 py-1">
            Enter
          </kbd>{" "}
          to roll, or let go to cancel.
        </p>
      )}
      <ul className="flex list-none items-center flex-col text-2xl mt-10 w-full">
        {rolls.map((roll, i) => (
          <li
            className="first:mb-3 first:text-white first:font-bold text-gray-200 contents"
            key={i}
          >
            <Roll>{roll}</Roll>
          </li>
        ))}
      </ul>
    </main>
  );
}
