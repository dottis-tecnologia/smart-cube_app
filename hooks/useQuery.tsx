import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useQuery<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const isLoading = useRef(false);

  const fetch = async () => {
    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const result = await fn();
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

  return {
    data,
    isLoading,
    refetch: fetch,
  };
}
