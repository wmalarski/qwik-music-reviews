export const pathToYt = (title: string, name: string): string => {
  const value = `${title ?? ""} ${name ?? ""}`;
  const params = new URLSearchParams({ search_query: value });
  return `https://www.youtube.com/results?${params}`;
};

export const pathToGoogle = (title: string, name: string): string => {
  const value = `${title ?? ""} ${name ?? ""}`;
  const params = new URLSearchParams({ q: value });
  return `https://www.google.com/search?${params}`;
};
