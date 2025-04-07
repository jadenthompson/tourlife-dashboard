// src/hooks/useLongPress.js
import { useRef, useCallback } from "react";

export default function useLongPress(callback = () => {}, delay = 500) {
  const timerRef = useRef(null);

  const startPressTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      // Trigger the callback
      callback();

      // Provide haptic feedback if available
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10); // 10ms pulse
      }
    }, delay);
  }, [callback, delay]);

  const clearPressTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onMouseDown: startPressTimer,
    onTouchStart: startPressTimer,
    onMouseUp: clearPressTimer,
    onMouseLeave: clearPressTimer,
    onTouchEnd: clearPressTimer,
  };
}
