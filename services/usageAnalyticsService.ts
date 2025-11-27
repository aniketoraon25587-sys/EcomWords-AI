const getStorageKey = (userEmail: string): string => `ecomwords_usage_${userEmail}`;

// Records a single generation event with a timestamp.
export const recordGeneration = async (userEmail: string): Promise<void> => {
  const key = getStorageKey(userEmail);
  const data = localStorage.getItem(key);
  const records: number[] = data ? JSON.parse(data) : [];
  records.push(new Date().getTime());
  localStorage.setItem(key, JSON.stringify(records));
};

// Returns an array of generation counts for the last 7 days.
export const getWeeklyUsage = async (userEmail: string): Promise<number[]> => {
  const key = getStorageKey(userEmail);
  const data = localStorage.getItem(key);
  const records: number[] = data ? JSON.parse(data) : [];

  const weeklyUsage = Array(7).fill(0);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  records.forEach(timestamp => {
    const recordDate = new Date(timestamp);
    const diffTime = today.getTime() - recordDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
      // index 6 is today, 5 is yesterday, etc.
      const dayIndex = 6 - diffDays;
      weeklyUsage[dayIndex]++;
    }
  });

  return weeklyUsage;
};
