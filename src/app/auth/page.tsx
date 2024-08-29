// import { FormItem } from '@/components/formitem'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { login } from './action'

import { AuthForm } from '@/components/auth-form'

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      {/* <form action={login} className="space-y-2"> */}
      {/*   <FormItem label="Username"> */}
      {/*     {({ id }) => <Input name="username" id={id} />} */}
      {/*   </FormItem> */}

      {/*   <FormItem label="Password"> */}
      {/*     {({ id }) => <Input name="password" type="password" id={id} />} */}
      {/*   </FormItem> */}

      {/*   <Button type="submit">Login</Button> */}
      {/* </form> */}
      <AuthForm />
    </div>
  )
}
