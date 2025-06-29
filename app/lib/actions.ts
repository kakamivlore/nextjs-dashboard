'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const FormSchemaProject = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  title: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  description: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  date: z.string(),
});

const CreateProject = FormSchemaProject.omit({ id: true, date: true });
//const UpdateProject = FormSchemaProject.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    return {
      message: `Database Error: Failed to Create Invoice.
                ${error}`,
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Invoice.
                      ${error}`
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


/* PROJECT SECTION */
export type ProjectState = {
  errors?: {
    customerId?: string[];
    title?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createProject(prevState: ProjectState, formData: FormData) {
  const validatedFields = CreateProject.safeParse({
    customerId: formData.get('customerId'),
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
    };
  }

  const { customerId, title, description } = validatedFields.data;
  const imageUrls = formData.getAll('images') as string[]; // Get all image URLs
  const updatedAt = new Date().toISOString().split('T')[0];

  try {
    const result = await sql`
    INSERT INTO projects (customer_id, title, description, created_at, updated_at, image_url)
    VALUES (${customerId}, ${title}, ${description}, ${updatedAt}, ${updatedAt}, ${imageUrls[0]})
    RETURNING id;
    `;

    const projectId = result[0].id;
    // If there are image URLs, insert them into the project_images table
    if (imageUrls.length > 0 && projectId) {
      console.log("im in")
      const imageInsertPromises = imageUrls.map(url =>
        sql`
          INSERT INTO project_images (project_id, image_url)
          VALUES (${projectId}, ${url});
        `
      );
      console.log(imageInsertPromises);
      await Promise.all(imageInsertPromises);
    }

  } catch (error) {
    return {
      message: `Database Error: Failed to Create Project.
                ${error}`,
    };
  }

  revalidatePath('/dashboard/projects');
  redirect('/dashboard/projects');
}

export async function updateProject(id: string, prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    customerId: formData.get('customer_id'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Project.',
    };
  }

  /*
  const { customerId, title, description } = UpdateProject.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    customerId: formData.get('customer_id'),
  });



  try {
    await sql`
    UPDATE projects
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return {
      message: `Database Error: Failed to Update Invoice.
                      ${error}`
    };
  }
    */

  revalidatePath('/dashboard/projects');
  redirect('/dashboard/projects');
}
