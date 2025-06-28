'use client'; // This directive makes this a Client Component

import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
// No need to import fetchRevenue here as it's passed as a prop from a Server Component now
import { useState } from 'react'; // Import useState

// Define the type for your revenue data
interface Revenue {
  month: string;
  revenue: number;
}

export default function RevenueChart({ revenue }: { revenue: Revenue[] }) {
  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  // State to keep track of the hovered month
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div
              key={month.month}
              className="relative flex flex-col items-center gap-2"
              onMouseEnter={() => setHoveredMonth(month.month)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              {/* Display revenue on hover */}
              {hoveredMonth === month.month && (
                <div className="absolute -top-6 rounded-md bg-gray-700 px-2 py-1 text-xs text-white">
                  €{month.revenue.toLocaleString()}
                </div>
              )}
              <div
                className={`w-full rounded-md ${
                  hoveredMonth === month.month ? 'bg-blue-600' : 'bg-blue-300'
                }`}
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}