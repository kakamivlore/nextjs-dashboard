import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation';

import Form from '@/app/ui/projects/edit-form';
import { fetchCustomers, fetchProjectById } from '@/app/lib/data';
 
export default async function Page(props: { params: Promise<{ id: string }>}) {
  const params = await props.params;
  const id = params.id;
  const [project, customers] = await Promise.all([
    fetchProjectById(id),
    fetchCustomers(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Projects', href: '/dashboard/projects' },
          {
            label: 'Edit Project',
            href: `/dashboard/projects/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form project={project} customers={customers} />
    </main>
  );
}