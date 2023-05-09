import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function myServerAction() {
  'use server'
  const count = cookies().get('test-count')?.value ?? 0

  const updatedCount = Number(count) + 1

  console.log('server action', updatedCount)

  cookies().set('test-count', updatedCount.toString())
  revalidatePath('/test')
}

export default function TestPage() {
  const count = Number(cookies().get('test-count')?.value ?? 0)

  return (
    <div>
      This is a test, count: {count}
      <form action={myServerAction}>
        <button type="submit">Do the action</button>
      </form>
    </div>
  )
}
