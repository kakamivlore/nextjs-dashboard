'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useActionState, useState } from 'react';

import { Button } from '@/app/ui/button';
import { CustomerField } from '@/app/lib/definitions';
import { createProject, ProjectState } from '@/app/lib/actions'
import ImageUpload from '@/app/ui/image-upload';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState: ProjectState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProject, initialState);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImageUpload = (url: string) => {
    setImageUrls((prev) => [...prev, url]);
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
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

        {/* Project Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Project Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter project title"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="title-error"
          />
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Project Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter project description"
            rows={4}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="description-error"
          />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Photo Upload */}
        <ImageUpload
          value={imageUrls}
          onChange={handleImageUpload}
        />

        {/* You can serialize image URLs to a hidden input to pass to Server Action */}
        {imageUrls.map((url, index) => (
          <input
            key={index}
            type="hidden"
            name="images"
            value={url}
          />
        ))}


        <div id="any-error" aria-live="polite" aria-atomic="true">
          {(state.errors?.title || state.errors?.description || state.errors?.customerId) && (
            <p className="mt-2 text-sm text-red-500">
              Missing Fields. Failed to Create Project.
            </p>
          )}
        </div>
      </div>


      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/projects"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
}
