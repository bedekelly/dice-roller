import {
  MutableRef,
  StateUpdater,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";
import parseDice from "./parser";
import rollDice from "./roller";
import "./blink.css";
import useRefState from "./useRefState";

function Blinking() {
  return <div className="blink">_</div>;
}

function Roll({
  children: [input, output, individual],
}: {
  children: [string, number, number[]];
}) {
  return (
    <div className="w-full flex my-1">
      <div className="w-1/2 text-right">{input.trim()} = </div>
      <div className="w-1/2">
        &nbsp;{output}{" "}
        {individual.length > 1 && (
          <span className="opacity-50 text-lg">({individual.join(" + ")})</span>
        )}
      </div>
    </div>
  );
}

function isValidInput(input: string | null): input is string {
  if (!input) return false;
  if (input.includes("...")) return false;
  return true;
}

export function App() {
  const [keys, setKeys] = useState<string[]>([]);
  const [rolls, setRolls] = useState<[string, number, number[]][]>([]);
  const [watchingRef, watching, setWatching] = useRefState(false);

  useEffect(() => {
    // Given the current set of keys, roll the dice and update our input.
    function getNewKeys(currentKeys: string[]) {
      const rollInput = parseDice(currentKeys);
      setWatching(false);
      if (isValidInput(rollInput)) {
        const [output, individual] = rollDice(rollInput);
        setRolls((oldRolls) => [
          [rollInput, output, individual],
          ...oldRolls.slice(0, 10),
        ]);
      }
      return [];
    }

    function keyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      if (event.key === "r") {
        setWatching(true);
        return;
      }

      if (!watchingRef.current) return;

      if (event.key === "Escape") {
        setKeys([]);
        setWatching(false);
        return;
      }

      if (event.key === "Backspace") {
        setKeys((oldKeys) => oldKeys.slice(0, -1));
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        setKeys(getNewKeys);
        return;
      }

      if ("1234567890".includes(event.key)) {
        setKeys((oldKeys) => [...oldKeys, event.key]);
      }
    }

    function keyUp(event: KeyboardEvent) {
      if (event.key === "r") {
        setKeys(getNewKeys);
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
          Let go to roll, or hit{" "}
          <kbd className="border border-gray-300 rounded-lg px-2 py-1 mx-1">
            Esc
          </kbd>{" "}
          to cancel.
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
