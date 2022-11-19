export const paths = {
  album: (id: string) => `/album/${id}`,
  albumEdit: (id: string) => `/album/${id}/edit`,
  albumRemove: (id: string) => `/album/${id}/remove`,
  albumReview: (id: string) => `/album/${id}/review`,
  home: "/",
  nextSignIn: "/api/auth/signin",
  nextSignOut: "/api/auth/signout",
  reviewEdit: (id: string) => `/reviews/${id}/edit`,
  reviews: "/reviews",
  search: "/search",
  signIn: "/signIn",
};
