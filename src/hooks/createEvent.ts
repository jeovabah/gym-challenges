import { useEffect, useState } from "react";

type Listener<T> = (value: T) => void;

const createEvent = <T>(initialValue: T) => {
  let value = initialValue;
  const listeners = new Set<Listener<T>>();

  const useListener = () => {
    const [state, setState] = useState(value);

    useEffect(() => {
      const listener = (newValue: T) => setState(newValue);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    return state;
  };

  const dispatch = (newValue: T) => {
    value = newValue;
    listeners.forEach((listener) => listener(value));
  };

  return { useListener, dispatch };
};

export default createEvent;
