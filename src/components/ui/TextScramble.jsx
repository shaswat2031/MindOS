'use client';
import { useEffect, useState, useCallback } from 'react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export const TextScramble = ({ text, autostart = true, delay = 0 }) => {
  const [output, setOutput] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(async () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setOutput(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  }, [text, isScrambling]);

  useEffect(() => {
    if (autostart) {
      const timeout = setTimeout(scramble, delay);
      return () => clearTimeout(timeout);
    }
  }, [autostart, delay, scramble]);

  return (
    <span 
      onMouseEnter={scramble}
      className="inline-block cursor-default font-mono"
    >
      {output || text}
    </span>
  );
};
