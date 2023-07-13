import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem(key);

      if (data != null) {
        setValue(JSON.parse(data));
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const setPersistentValue = (newValue: T) => {
    setValue(newValue);
    AsyncStorage.setItem(key, JSON.stringify(newValue));
  };

  return {
    value,
    setValue: setPersistentValue,
    clear: async () => {
      await AsyncStorage.removeItem(key);
      setValue(defaultValue);
    },
    isLoading,
  };
}
