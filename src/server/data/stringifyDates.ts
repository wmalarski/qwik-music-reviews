// Qwik is serializing dates correctly now
// this code is changing those dates to string
export const stringifyDates = <T>(arg: T): T => {
  if (!arg) {
    return arg;
  }

  if (typeof arg === "object") {
    Object.entries(arg).forEach(([key, value]) => {
      Object.assign(arg, {
        [key]:
          key === "createdAt" ? value.toISOString() : stringifyDates(value),
      });
    });
  }

  return arg;
};
