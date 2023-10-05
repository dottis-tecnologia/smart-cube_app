import { useFocusEffect } from "@react-navigation/native";
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export default function useInfiniteQuery<T, R>(
  fn: (options: { pageParam: R }) => T | Promise<T>,
  getNextPageParam: (lastPage: T | null, allPages: T[]) => R | null,
  deps: DependencyList,

  options?: { isDisabled?: boolean }
) {
  const [data, setData] = useState<T[]>([]);
  const isLoading = useRef(false);
  const isDisabled = options?.isDisabled || false;

  const wrappedFunc = useMemo(() => {
    return fn;
  }, deps);

  const fetchNextPage = async () => {
    if (isDisabled) {
      setData([]);
      return;
    }

    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const pageParam = getNextPageParam(
        data.length > 0 ? data[data.length - 1] : null,
        data
      );
      if (pageParam != null) {
        const result = await wrappedFunc({ pageParam });
        setData([...data, result]);
      }
    } finally {
      isLoading.current = false;
    }
  };

  const refetch = () => {
    setData([]);
    fetchNextPage();
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  useEffect(() => {
    fetchNextPage();
  }, [wrappedFunc]);

  return {
    data,
    isLoading,
    refetch,
    fetchNextPage,
  };
}
