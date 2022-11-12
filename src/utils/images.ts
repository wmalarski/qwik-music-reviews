export type Covers = Record<string, string[]>;

export const getCoversAttributes = (covers: Covers) => {
  const sources = Object.values(covers).flat();

  if (sources.length < 1) {
    return { src: "", srcSet: "" };
  }

  const grouped = sources.reduce<Record<string, string>>((prev, curr) => {
    const size = curr.match(/-(\d+)\.jpg$/)?.[1];
    if (!size || size in prev) {
      return prev;
    }
    prev[size] = curr;
    return prev;
  }, {});

  const srcSet = Object.entries(grouped)
    .map(([key, value]) => `${value} ${key}w`)
    .join(", ");

  const sorted = Object.keys(grouped)
    .map((key) => +key)
    .sort((a, b) => a - b);

  const src = grouped[sorted[0]];

  return { src, srcSet };
};
