import { Suspense } from 'react';

import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Cards from '@/app/ui/projects/cards';
import { CreateProject } from '@/app/ui/projects/buttons';
import { lusitana } from '@/app/ui/fonts';
import { CardsSkeleton } from '@/app/ui/skeletons';

import { fetchInvoicesPages } from '@/app/lib/data';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Projects</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search projects..." />
        <CreateProject />
      </div>
      <Suspense key={query + currentPage} fallback={<CardsSkeleton />}>
        <Cards query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
