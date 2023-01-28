// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formEntries = (form: FormData): Record<string, any> => {
  return Object.fromEntries(form.entries());
};
