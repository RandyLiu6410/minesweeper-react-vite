import React from "react";

export interface TimerProps {
  onTimeChange?: (currentTime: number) => void;
}

export interface TimerRef {
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const Timer = React.forwardRef<TimerRef, TimerProps>(
  ({ onTimeChange }, ref) => {
    const [currentTime, setCurrentTime] = React.useState(0);

    React.useEffect(() => {
      onTimeChange && onTimeChange(currentTime);
    }, [currentTime]);

    React.useImperativeHandle(ref, () => ({
      start,
      pause,
      reset,
    }));

    let interval: NodeJS.Timer | undefined;

    const start = React.useCallback(() => {
      reset();
      startInterval();
    }, []);

    const pause = React.useCallback(() => {
      killInterval();
    }, []);

    const reset = React.useCallback(() => {
      setCurrentTime(0);
      killInterval();
    }, []);

    const startInterval = React.useCallback(() => {
      if (interval === undefined) {
        interval = setInterval(() => {
          setCurrentTime((prev) => prev + 1);
        }, 1000);
      }
    }, []);

    const killInterval = React.useCallback(() => {
      if (interval !== undefined) {
        clearInterval(interval);
        interval = undefined;
      }
    }, []);

    React.useEffect(() => {
      return () => {
        if (interval !== undefined) clearInterval(interval);
      };
    }, []);

    return null;
  }
);
