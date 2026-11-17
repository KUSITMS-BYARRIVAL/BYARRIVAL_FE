import { useCallback, useEffect, useRef } from "react";

/**
 * 마지막 호출 뒤 delay(ms)가 지나면 그 호출 하나만 실행한다.
 * 기다리는 중에 화면을 떠나면(언마운트) 버리지 않고 바로 실행한다.
 */
export function useDebouncedCallback<T>(
  callback: (value: T) => void,
  delay: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<{ value: T } | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const flush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (pending) callbackRef.current(pending.value);
  }, []);

  useEffect(() => flush, [flush]);

  return useCallback(
    (value: T) => {
      pendingRef.current = { value };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, delay);
    },
    [delay, flush],
  );
}
