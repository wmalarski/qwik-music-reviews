import { $, component$, PropFunction, useSignal } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Session } from "next-auth";
import {
  ReviewListCard,
  ReviewListItem,
} from "./ReviewListCard/ReviewListCard";

type Props = {
  collection: ReviewListItem[];
  currentPage: number;
  onMore$?: PropFunction<() => void>;
  pageCount: number;
  parentContainer?: Element | null;
  removeAction: FormProps<unknown>["action"];
  session: Session;
};

export const ReviewList = component$<Props>((props) => {
  const parentContainer = props.parentContainer;
  const onMore$ = props.onMore$;
  const currentPage = props.currentPage;
  const pageCount = props.pageCount;

  const throttleTimer = useSignal(false);
  const scrollEnabled = useSignal(currentPage < pageCount);

  const handleScroll$ = $(() => {
    if (!parentContainer) {
      return;
    }

    const endOfPage =
      parentContainer.clientHeight + parentContainer.scrollTop >=
      parentContainer.scrollHeight - 100;

    if (endOfPage) {
      onMore$?.();
    }

    if (currentPage === pageCount) {
      scrollEnabled.value = false;
    }
  });

  return (
    <section>
      <div
        document:onScroll$={() => {
          if (throttleTimer.value || !scrollEnabled.value) {
            return;
          }
          throttleTimer.value = true;
          setTimeout(() => {
            handleScroll$();
            throttleTimer.value = false;
          }, 1000);
        }}
        class="grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-4 p-8"
      >
        {props.collection?.map((review) => (
          <ReviewListCard
            key={review.id}
            removeAction={props.removeAction}
            review={review}
            session={props.session}
          />
        ))}
      </div>
    </section>
  );
});
