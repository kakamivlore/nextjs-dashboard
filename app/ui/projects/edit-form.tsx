'use client';

import { useActionState } from 'react';
import { CustomerField, ProjectForm } from '@/app/lib/definitions';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { State, updateProject } from '@/app/lib/actions';
import Image from 'next/image';

export default function EditProjectForm({
  project,
  customers,
}: {
  project: ProjectForm;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const updateProjectWithId = updateProject.bind(null, project.id);
  const [state, formAction] = useActionState(updateProjectWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              defaultValue={project.customer_id}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Project Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={project.title}
            placeholder="Enter project title"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Project Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={project.description}
            rows={4}
            placeholder="Describe the project..."
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>


        {/*  
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {project.image_urls.map((url, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <img
                src={url}
                alt={`Project Image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 text-center text-xs text-gray-500">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
        */}

        {project.image_urls?.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {project.image_urls.map((url, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
              >
                <Image
                  width={500}
                  height={300}
                  src={url}
                  alt={`Project Image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 text-center text-xs text-gray-500">
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}





      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/projects"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save Project</Button>
      </div>
    </form>
  );
}
