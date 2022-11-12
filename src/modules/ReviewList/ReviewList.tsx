import { $, component$, PropFunction, useSignal } from "@builder.io/qwik";
import {
  ReviewListCard,
  ReviewListItem,
} from "./ReviewListCard/ReviewListCard";

type Props = {
  collection: ReviewListItem[];
  currentPage: number;
  pageCount: number;
  onMore$?: PropFunction<() => void>;
  parentContainer?: Element | null;
};

export const ReviewList = component$(
  ({ collection, parentContainer, onMore$, currentPage, pageCount }: Props) => {
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
          {collection?.map((review) => (
            <ReviewListCard review={review} />
          ))}
        </div>
      </section>
    );
  }
);
