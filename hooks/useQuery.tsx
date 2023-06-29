import { useEffect, useState } from "react";
import { query } from "../util/db";

export default function useQuery<T>(queryString: string, params?: unknown[]) {
  const [data, setData] = useState<T[] | null>(null);

  const fetch = async () => {
    const result = await query<T>(queryString, params);

    if (result == null) {
      setData(null);
      return;
    }

    setData(result.rows);
  };

  useEffect(() => {
    fetch();
  }, [query]);

  return {
    data,
    refetch: fetch,
  };
}
