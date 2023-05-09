import { cookies } from 'next/headers'
import { myServerAction } from '~/serverAction'

export function CounterForm() {
  const count = Number(cookies().get('test-count')?.value ?? 0)

  return (
    <div>
      <form action={myServerAction}>
        <button type="submit">Do the action</button>
      </form>
      <div> count: {count}</div>
    </div>
  )
}
