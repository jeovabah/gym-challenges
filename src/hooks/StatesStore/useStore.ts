import { useSyncExternalStore } from "react";

type Listener = () => void;

class Store<T> {
  private state: T;
  private listeners: Set<Listener>;

  constructor(initialState: T) {
    this.state = initialState;
    this.listeners = new Set();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.state;
  }

  setState(newState: any) {
    if (typeof newState !== "undefined") {
      this.state = newState;
      this.listeners.forEach((listener) => listener());
    }
  }

  setStateWithPrevState(callback: (prevState: T) => T | void): void {
    const prevState = this.state;
    const nextState = callback(prevState);
    if (nextState !== undefined) {
      this.setState(nextState);
    }
  }

  addNewObject(newObject: T) {
    this.setStateWithPrevState((prevState: T) => {
      if (Array.isArray(prevState)) {
        return [...prevState, newObject] as T;
      }
      throw new Error("prevState is not an array");
    });
  }

  removeObject(id: string) {
    this.setStateWithPrevState((prevState: T) => {
      if (Array.isArray(prevState)) {
        return prevState.filter((item) => item.id !== id) as T;
      }
      throw new Error("prevState is not an array");
    });
  }
}

export function createUseStore<T>(initialState: T) {
  const store = new Store(initialState);

  function useStore() {
    return useSyncExternalStore(
      store.subscribe.bind(store),
      store.getSnapshot.bind(store)
    );
  }

  return [
    useStore,
    store.setState.bind(store),
    store.setStateWithPrevState.bind(store),
    store.addNewObject.bind(store),
    store.removeObject.bind(store),
  ] as const;
}
