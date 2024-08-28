import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login } from './action'

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <form action={login}>
        <Input name="username" />
        <Input name="password" type="password" />
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}
