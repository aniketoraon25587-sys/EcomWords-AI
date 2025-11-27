import React from 'react';

interface UsageAnalyticsGraphProps {
  data: number[]; // Array of 7 numbers, for the last 7 days
}

const UsageAnalyticsGraph: React.FC<UsageAnalyticsGraphProps> = ({ data }) => {
  const maxUsage = Math.max(...data, 5); // Ensure a minimum height for the graph

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();
  const dayLabels = Array(7).fill(0).map((_, i) => days[(todayIndex - 6 + i + 7) % 7]);

  return (
    <div className="bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light">
      <h3 className="text-xl font-bold text-white mb-1">Weekly Generation Stats</h3>
      <p className="text-sm text-gray-400 mb-6">Your activity over the last 7 days.</p>
      <div className="flex justify-around items-end h-48 gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-white font-bold text-sm mb-1">{value}</div>
            <div
              className="w-full bg-gradient-to-t from-royal-blue to-electric-cyan rounded-t-md hover:opacity-80 transition-opacity"
              style={{ height: `${(value / maxUsage) * 100}%` }}
              title={`${value} generations on ${dayLabels[index]}`}
            />
            <div className="text-xs text-gray-500 mt-2">{dayLabels[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageAnalyticsGraph;
