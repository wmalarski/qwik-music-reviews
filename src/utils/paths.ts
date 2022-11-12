export const paths = {
  album: (id: string) => `/album/${id}`,
  home: "/",
  nextSignIn: "/api/auth/signin",
  nextSignOut: "/api/auth/signout",
  search: (page: number, query: string) =>
    `/search?${new URLSearchParams({ page: `${page || 0}`, query })}`,
  signIn: "/signIn",
};
