import { useFocusEffect } from "@react-navigation/native";
import type { StatusBarProps } from "expo-status-bar";
import { createContext, useCallback, useContext } from "react";

export type StatusBarData = {
  setProps: (props: StatusBarProps) => void;
};

export const StatusBarContext = createContext<StatusBarData>({
  setProps: () => {},
});

const useStatusBar = (props: StatusBarProps) => {
  const { setProps } = useContext(StatusBarContext);
  useFocusEffect(useCallback(() => setProps(props), []));
};

export default useStatusBar;
