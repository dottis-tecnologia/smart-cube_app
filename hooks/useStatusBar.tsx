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
  const { style, backgroundColor, translucent, hidden, networkActivityIndicatorVisible, hideTransitionAnimation, animated } = props;
  useFocusEffect(
    useCallback(() => {
      setProps({ style, backgroundColor, translucent, hidden, networkActivityIndicatorVisible, hideTransitionAnimation, animated });
    }, [style, backgroundColor, translucent, hidden, networkActivityIndicatorVisible, hideTransitionAnimation, animated])
  );
};

export default useStatusBar;
