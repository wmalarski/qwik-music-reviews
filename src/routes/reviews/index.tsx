import { component$, useSignal } from "@builder.io/qwik";
import {
  routeLoader$,
  server$,
  z,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import type { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import {
  getNullableProtectedRequestContext,
  getProtectedRequestContext,
} from "~/server/auth/context";
import { countReviewsByDate, findReviews } from "~/server/data/review";
import { useSessionContextProvider } from "~/utils/SessionContext";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const useProtectedSessionLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);

  return ctx.session;
});

export const useReviewsLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);

  return findReviews({ ctx, skip: 0, take: 20 });
});

export const fetchMoreReviews = server$(async function (page: number) {
  const ctx = await getNullableProtectedRequestContext(this);

  if (!ctx) {
    return null;
  }

  const parsedPage = z.coerce.number().min(0).int().default(0).parse(page);

  return findReviews({ ctx, skip: parsedPage * 20, take: 20 });
});

export const useCountsLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);

  return countReviewsByDate({ ctx });
});

export default component$(() => {
  const reviews = useReviewsLoader();
  const counts = useCountsLoader();

  const session = useProtectedSessionLoader();
  useSessionContextProvider(session);

  const containerRef = useSignal<Element | null>(null);

  const collection = useSignal<ReviewListItem[]>(reviews.value.reviews);
  const currentPage = useSignal(1);

  return (
    <div
      ref={(e) => (containerRef.value = e)}
      class="max-h-screen overflow-y-scroll"
    >
      <h1 class="px-8 py-8 text-2xl">Reviews</h1>
      <div class="px-8">
        <ReviewActivity counts={counts.value} />
      </div>
      <ReviewList
        collection={collection.value}
        currentPage={currentPage.value}
        pageCount={Math.floor(reviews.value.count / 20)}
        parentContainer={containerRef.value}
        onMore$={async () => {
          const json = await fetchMoreReviews(currentPage.value);
          const newAlbums = json?.reviews || [];
          currentPage.value += 1;
          collection.value = [...collection.value, ...newAlbums];
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Reviews - Qwik Album Review",
};
