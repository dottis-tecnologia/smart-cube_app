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
  fn: (pageParam: R) => T | Promise<T>,
  getNextPageParam: (lastPage: T | null, allPages: T[]) => R | null,
  deps: DependencyList,

  options?: { isDisabled?: boolean }
) {
  const [data, setData] = useState<T[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoading = useRef(false);
  const nextPageParam = useRef<R | null>();
  const isDisabled = options?.isDisabled || false;

  const wrappedFunc = useMemo(() => {
    return fn;
  }, deps);

  const fetchNextPage = async () => {
    if (isFinished) return;

    if (isDisabled) {
      setData([]);
      setIsFinished(true);
      return;
    }

    if (isLoading.current) return;
    isLoading.current = true;

    try {
      let pageParam =
        nextPageParam.current ??
        getNextPageParam(data.length > 0 ? data[data.length - 1] : null, data);
      nextPageParam.current = undefined;

      if (pageParam != null) {
        const result = await wrappedFunc(pageParam);
        setData((prev) => [...prev, result]);
      } else {
        setIsFinished(true);
      }
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    const pageParam = getNextPageParam(
      data.length > 0 ? data[data.length - 1] : null,
      data
    );
    nextPageParam.current = pageParam;

    if (pageParam == null) {
      setIsFinished(true);
      return;
    }
  }, [data]);

  const clear = () => {
    setData([]);
    setIsFinished(false);
    return fetchNextPage();
  };

  const refresh = () => {
    setIsRefreshing(true);
    clear().then(() => setIsRefreshing(false));
  };

  useFocusEffect(
    useCallback(() => {
      clear();
    }, [])
  );

  useEffect(() => {
    clear();
  }, [wrappedFunc]);

  return {
    data,
    isFinished,
    isRefreshing,
    refresh,
    fetchNextPage,
  };
}
