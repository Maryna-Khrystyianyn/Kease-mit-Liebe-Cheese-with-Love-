import React, { useEffect, useState, useRef } from 'react';
import { Text, TextStyle } from 'react-native';

interface CounterProps {
  targetValue: number;
  duration?: number;
  style?: TextStyle;
  className?: string;
  suffix?: string;
}

export const Counter: React.FC<CounterProps> = ({ targetValue, duration = 2000, style, className, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easedProgress = progress * (2 - progress);
      
      const currentCount = easedProgress * targetValue;
      setCount(currentCount);

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [targetValue, duration]);

  return <Text style={style} className={className}>{count.toFixed(1)}{suffix}</Text>;
};
