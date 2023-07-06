import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, (v: T) => void, () => Promise<void>] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem(key);

      if (data == null) return;

      setValue(JSON.parse(data));
    };

    fetchData();
  }, []);

  const setPersistentValue = (newValue: T) => {
    setValue(newValue);
    AsyncStorage.setItem(key, JSON.stringify(newValue));
  };

  return [
    value,
    setPersistentValue,
    async () => {
      await AsyncStorage.removeItem(key);
      setValue(defaultValue);
    },
  ];
}
