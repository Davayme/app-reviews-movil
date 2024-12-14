import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  PropsWithChildren,
} from "react";
import { Animated } from "react-native";
import { ToastContext } from "./ToastContext";
import { Toast } from "./Toast";

type ToastProviderProps = PropsWithChildren<{}>;
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info" | "warning">(
    "info"
  );
  const slideAnim = useMemo(() => new Animated.Value(100), []);

  const showToast = useCallback(
    (
      msg: string,
      toastType: "success" | "error" | "info" | "warning",
      duration = 3000
    ) => {
      setMessage(msg);
      setType(toastType);
      setVisible(true);

      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      setTimeout(hideToast, duration);
    },
    []
  );

  const hideToast = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }, []);

  const value = useMemo(
    () => ({ showToast, hideToast }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        slideAnim={slideAnim}
      />
    </ToastContext.Provider>
  );
};
