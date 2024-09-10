export const auth = "/auth";
export const logout = "/api/logout";

export const user = (userId: string) => `/users/${userId}`;
export const userPosts = (userId: string) => `/users/${userId}/posts`;
export const userReplies = (userId: string) => `/users/${userId}/replies`;
export const userLikes = (userId: string) => `/users/${userId}/likes`;

export const userPage = (userId: string, page: string) =>
  `/users/${userId}/${page}`;

export const home = "/";

export const search = "/search";

export const searchPosts = (query: string) => `/search/${query}`;
export const searchUsers = (query: string) => `/search/${query}/users`;
export const searchHashtags = (query: string) => `/search/${query}/hashtags`;

export const feeds = "/explore";

export const about = "/about";

export const notifications = "/notifications";
