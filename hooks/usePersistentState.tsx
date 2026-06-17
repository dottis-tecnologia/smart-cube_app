import { useEffect, useState } from "react";
import AsyncStorage from "expo-sqlite/kv-store";

export default function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItemAsync(key);

      if (data != null) {
        setValue(JSON.parse(data));
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const setPersistentValue = (newValue: T) => {
    setValue(newValue);
    AsyncStorage.setItemAsync(key, JSON.stringify(newValue));
  };

  return {
    value,
    setValue: setPersistentValue,
    clear: async () => {
      await AsyncStorage.removeItemAsync(key);
      setValue(defaultValue);
    },
    isLoading,
  };
}
