import { useState } from "react";

export default function useMutation<T extends any[] | [], R, E extends Error>(
  fn: (...args: T) => Promise<R>,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: () => void;
  } = {}
) {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<E | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const mutate = async (...args: T) => {
    try {
      setIsMutating(true);
      await fn(...args);
      onSuccess?.();
    } catch (e) {
      setError(e as E);
      onError?.();
    } finally {
      setIsMutating(false);
      setIsFinished(true);
    }
  };

  return {
    isMutating,
    error,
    isError: error != null,
    isFinished,
    isSuccess: isFinished && error == null,
    mutate,
  };
}
