import { fetchFilteredProjects } from '@/app/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

/*
type Project = {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
  image?: string;
};

async function fetchProjects(query: string, page: number): Promise<Project[]> {
  const sampleData: Project[] = [
    {
      id: '1',
      name: 'Project Apollo',
      description: 'Lunar mission project',
      updatedAt: '2025-06-01',
      image: 'building.png',
    },
    {
      id: '2',
      name: 'Project Zephyr',
      description: 'Wind turbine initiative',
      updatedAt: '2025-05-15',
      image: 'construction-site.png',
    },

    {
      id: '3',
      name: 'Project mado',
      description: 'Lunar mission project',
      updatedAt: '2025-06-01',
      image: 'building.png',
    },
    {
      id: '4',
      name: 'Project cane',
      description: 'Wind turbine initiative',
      updatedAt: '2025-05-15',
      image: 'construction-site.png',
    },
    {
      id: '5',
      name: 'Project zio',
      description: 'Lunar mission project',
      updatedAt: '2025-06-01',
      image: 'building.png',
    }

  ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const pageSize = 6;
  const start = (page - 1) * pageSize;
  return sampleData.slice(start, start + pageSize);
}
*/

export default async function Cards({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const projects = await fetchFilteredProjects(query, currentPage);

  if (projects.length === 0) {
    return <p className="mt-6 text-center text-gray-500">No projects found.</p>;
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg border border-gray-200 shadow hover:shadow-md transition"
        >
          <Link href={`/dashboard/projects/${project.id}/edit`}> 
          {project.image_url && (
            <Image
              src={`${project.image_url}`}
              alt={project.title}
              width={400}
              height={250}
              className="rounded-t-lg w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            {project.description && (
              <p className="mt-2 text-gray-600">{project.description}</p>
            )}
            <p className="mt-3 text-sm text-gray-400">
              Last updated: {new Date(project.updated_at).toLocaleDateString()}
            </p>
          </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
