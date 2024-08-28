'use server'

import { agent } from '@/lib/atp-client'
import { zfd } from "zod-form-data";
import { cookies } from 'next/headers'

const loginSchema = zfd.formData({
  username: zfd.text(),
  password: zfd.text()
})

export async function login(formData: FormData) {
  const {
    username,
    password,
  } = loginSchema.parse(formData)

  const { data } = await agent.login({
    identifier: username,
    password: password
  })

  const { accessJwt, refreshJwt, did, handle } = data

  cookies().set('accessJwt', accessJwt)
  cookies().set('refreshJwt', refreshJwt)
  cookies().set('did', did)
  cookies().set('handle', handle)
}
