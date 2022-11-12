import { component$ } from "@builder.io/qwik";
import type { RouterOutput } from "~/utils/trpc";
import { getCountItems } from "./ReviewActivity.utils";

type Props = {
  counts: RouterOutput["review"]["countReviewsByDate"];
};

export const ReviewActivity = component$((props: Props) => {
  const { items, months } = getCountItems(props.counts);

  return (
    <section class="grid gap-1 days-grid">
      {months?.map((item) => {
        const content = new Intl.DateTimeFormat("pl", {
          month: "long",
        }).format(new Date(0, item.month));
        return (
          <span
            class="btn btn-xs truncate"
            style={`grid-column: ${item.position} / span ${item.span};`}
            title={content}
          >
            {content}
          </span>
        );
      })}
      {items.map((item) => (
        <span
          class={`bg-activity-${item.suffix} hover:bg-activity-${item.suffix}`}
          title={new Intl.DateTimeFormat("pl").format(item.date)}
        >
          {item.count || 0}
        </span>
      ))}
    </section>
  );
});
