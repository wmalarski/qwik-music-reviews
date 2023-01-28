// Qwik is serializing dates correctly now
// this code is changing those dates to string
export const stringifyDates = <T>(arg: T): T => {
  if (!arg) {
    return arg;
  }

  if (typeof arg === "object") {
    Object.entries(arg).forEach(([key, value]) => {
      if (key === "createdAt" && typeof value === "object") {
        Object.assign(arg, { [key]: value.toISOString() });
        return;
      }
      Object.assign(arg, { [key]: stringifyDates(value) });
    });
  }

  return arg;
};
