import { MutableRef, useCallback, useRef, useState } from "preact/hooks";

type RefState<T> = [MutableRef<T>, T, (newVal: T) => void];

export default function useRefState<T>(initialValue: T): RefState<T> {
  const ref = useRef<T>(initialValue);
  const [value, setValue] = useState(initialValue);

  const setValueAndUpdateRef = useCallback((value: T) => {
    ref.current = value;
    setValue(value);
  }, []);

  return [ref, value, setValueAndUpdateRef];
}
