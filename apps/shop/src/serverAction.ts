import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function myServerAction() {
  'use server'
  const count = cookies().get('test-count')?.value ?? 0

  const updatedCount = Number(count) + 1

  console.log('server action', updatedCount)

  //@ts-expect-error
  cookies().set('test-count', updatedCount.toString())
  revalidatePath('/test')
  revalidatePath('/')
  revalidatePath('/[categorySlug]')
}
