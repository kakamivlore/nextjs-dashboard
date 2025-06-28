import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';

import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { LatestInvoicesSkeleton, RevenueChartSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';

// Import your data fetching function
import { fetchRevenue } from '@/app/lib/data';

export default async function Page() {
  // Fetch the revenue data directly in this Server Component
  const revenue = await fetchRevenue();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          {/* Pass the fetched revenue data as a prop to RevenueChart */}
          <RevenueChart revenue={revenue} />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}