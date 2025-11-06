"use client";

import { useState, useEffect } from "react";

const DAILY_LIMIT = 3;
const STORAGE_KEY = "clip-summarizer-usage";

interface UsageData {
  count: number;
  date: string;
}

export function useFreeLimit() {
  const [usage, setUsage] = useState<UsageData>({ count: 0, date: "" });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();

    if (stored) {
      const data: UsageData = JSON.parse(stored);
      if (data.date === today) {
        setUsage(data);
      } else {
        const newData = { count: 0, date: today };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setUsage(newData);
      }
    } else {
      const newData = { count: 0, date: today };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setUsage(newData);
    }
  }, []);

  const canUse = () => usage.count < DAILY_LIMIT;

  const incrementUsage = () => {
    const newUsage = { ...usage, count: usage.count + 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
    setUsage(newUsage);
  };

  const remaining = () => Math.max(0, DAILY_LIMIT - usage.count);

  return { canUse, incrementUsage, remaining };
}
