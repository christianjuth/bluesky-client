export const auth = "/auth";

export const user = (userId: string) => `/users/${userId}`;

export const userPage = (userId: string, page: string) =>
  `/users/${userId}/${page}`;

export const home = "/";
