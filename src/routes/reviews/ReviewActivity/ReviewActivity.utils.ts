import type { RouterOutput } from "~/utils/trpc";

export const getCountItems = (
  groups: RouterOutput["review"]["countReviewsByDate"]
) => {
  const groupsMap = groups.reduce<Record<string, number>>((prev, curr) => {
    prev[new Date(curr.date).toDateString()] = curr.count;
    return prev;
  }, {});

  const maxCount = groups.reduce(
    (prev, curr) => Math.max(prev, Number(curr.count)),
    0
  );

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const daysOfWeek = new Array(7).fill(weekStart).map((date, index) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + index);
    return copy;
  });

  const rows = daysOfWeek.map((startDate) =>
    new Array(52)
      .fill(startDate)
      .map((date, index) => {
        const copy = new Date(date);
        copy.setDate(copy.getDate() - 7 * index);
        const count = Number(groupsMap[copy.toDateString()]) || 0;
        const suffix = Math.floor((count / maxCount) * 10) || 0;
        return { count, date: copy, suffix };
      })
      .reverse()
  );

  const reduced = rows[0]?.reduce<
    { month: number; count: number; columns: number }[]
  >((prev, { date }) => {
    const last = prev[prev.length - 1];
    if (last?.month === date.getMonth()) {
      last.columns += 1;
      last.count += 1;
      return prev;
    }
    const count = (last?.count || 0) + 1;
    prev.push({ columns: 1, count, month: date.getMonth() });
    return prev;
  }, []);

  const months = reduced?.map(({ columns, count, month }) => ({
    month,
    position: count - columns + 1,
    span: columns,
  }));

  return { items: rows.flatMap((elements) => elements), months };
};
