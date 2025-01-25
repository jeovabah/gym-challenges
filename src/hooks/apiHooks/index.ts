import { useState, useCallback } from "react";

export class ApiHook<T> {
  private fetchFunction: (...args: any[]) => Promise<T>;
  private setStateFunction: (data: T) => void;

  constructor(
    fetchFunction: (...args: any[]) => Promise<T>,
    setStateFunction: (data: T) => void
  ) {
    this.fetchFunction = fetchFunction;
    this.setStateFunction = setStateFunction;
  }

  useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<T | null>(null);

    const fetch = useCallback(async (...args: any[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedData = await this.fetchFunction(...args);
        this.setStateFunction(fetchedData);
        setData(fetchedData);
        return fetchedData;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []);

    return { fetch, isLoading, error, data };
  };
}
