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
  const isLoading = useRef(false);
  const isDisabled = options?.isDisabled || false;

  const wrappedFunc = useMemo(() => {
    return fn;
  }, deps);

  const fetch = async () => {
    if (isDisabled) {
      setData(null);
      return;
    }

    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const result = await wrappedFunc();
      setData(result);
    } finally {
      isLoading.current = false;
    }
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
