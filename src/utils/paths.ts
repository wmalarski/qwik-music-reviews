export const paths = {
  album: (id: string) => `/album/${id}`,
  albumEdit: (id: string) => `/album/${id}/edit`,
  albumReview: (id: string) => `/album/${id}/review`,
  home: "/",
  nextSignIn: "/api/auth/signin",
  nextSignOut: "/api/auth/signout",
  reviews: "/reviews",
  search: "/search",
  signIn: "/signIn",
};
