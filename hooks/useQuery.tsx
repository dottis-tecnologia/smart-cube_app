import { useFocusEffect } from "@react-navigation/native";
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export default function useQuery<T>(
  fn: () => T | Promise<T>,
  deps: DependencyList,
  options?: { isDisabled?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = options?.isDisabled || false;

  const wrappedFunc = useMemo(() => {
    return fn;
  }, deps);

  const fetch = async () => {
    if (isDisabled) {
      setData(null);
      return;
    }

    setIsLoading(true);
    const result = await wrappedFunc();
    setData(result);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetch();
    }, [])
  );

  useEffect(() => {
    fetch();
  }, [wrappedFunc]);

  return {
    data,
    isLoading,
    refetch: fetch,
  };
}
