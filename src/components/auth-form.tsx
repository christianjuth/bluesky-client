import { FormItem } from "@/components/form-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { agent } from "@/lib/bsky/agent";
import { zfd } from "zod-form-data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const loginSchema = zfd.formData({
  username: zfd.text(),
  password: zfd.text(),
});

async function login(formData: FormData) {
  "use server";

  const { username, password } = loginSchema.parse(formData);

  const { data } = await agent.login({
    identifier: username,
    password: password,
  });

  const { accessJwt, refreshJwt, did, handle } = data;

  cookies().set("accessJwt", accessJwt);
  cookies().set("refreshJwt", refreshJwt);
  cookies().set("did", did);
  cookies().set("handle", handle);

  redirect("/");
}

export function AuthForm() {
  return (
    <form action={login} className="space-y-2 w-full max-w-md">
      <FormItem label="Username">
        {({ id }) => <Input name="username" id={id} />}
      </FormItem>

      <FormItem label="Password">
        {({ id }) => <Input name="password" type="password" id={id} />}
      </FormItem>

      <Button type="submit">Login</Button>
    </form>
  );
}
