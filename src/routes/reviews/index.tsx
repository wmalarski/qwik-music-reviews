import { component$, useSignal, useStore } from "@builder.io/qwik";
import {
  action$,
  DocumentHead,
  loader$,
  useLocation,
  zod$,
} from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { getProtectedRequestContext } from "~/server/auth/context";
import {
  countReviewsByDate,
  deleteReview,
  findReviews,
} from "~/server/data/review";
import { paths } from "~/utils/paths";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const protectedSessionLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return ctx.session;
});

export const collectionLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return findReviews({ ctx, skip: 0, take: 20 });
});

export const countsLoader = loader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return countReviewsByDate({ ctx });
});

export const deleteReviewAction = action$(async (data, event) => {
  const ctx = await getProtectedRequestContext(event);

  const result = await deleteReview({ ctx, id: data.reviewId });

  if (result.count <= 0) {
    return { status: "error" as const };
  }

  event.redirect(302, paths.reviews);
  return { status: "success" as const };
}, zod$(z.object({ reviewId: z.string() }).shape));

export default component$(() => {
  const location = useLocation();

  const collection = collectionLoader.use();
  const counts = countsLoader.use();
  const session = protectedSessionLoader.use();
  const deleteReview = deleteReviewAction.use();

  const containerRef = useSignal<Element | null>(null);

  const store = useStore({
    currentPage: 1,
    results: [] as ReviewListItem[],
  });

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
        session={session.value}
        removeAction={deleteReview}
        collection={[...collection.value.reviews, ...store.results]}
        currentPage={store.currentPage}
        pageCount={Math.floor(collection.value.count / 20)}
        parentContainer={containerRef.value}
        onMore$={async () => {
          const url = `${location.href}api?${new URLSearchParams({
            query: location.query.get("query") || "",
            skip: `${(store.currentPage || 0) * 20}`,
          })}`;

          const json = await (await fetch(url)).json();

          if (json?.status === "success") {
            const newAlbums = json?.reviews || [];
            store.currentPage = store.currentPage + 1;
            store.results = [...store.results, ...newAlbums];
          }
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Reviews - Qwik Album Review",
};
