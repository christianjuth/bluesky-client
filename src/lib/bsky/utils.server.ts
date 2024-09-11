import "server-only";
import { getSession } from "./agent";

export const userIsMyself = async (userId: string) => {
  const session = await getSession();
  return session?.handle === userId || session?.did === userId;
};
