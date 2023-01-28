import { component$, useSignal, useStore } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { getProtectedRequestContext } from "~/server/auth/context";
import {
  countReviewsByDate,
  deleteReview,
  findReviews,
} from "~/server/data/review";
import { formEntries } from "~/utils/form";
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

export const deleteReviewAction = action$(async (form, event) => {
  const ctx = await getProtectedRequestContext(event);

  const parsed = z
    .object({ reviewId: z.string() })
    .safeParse(formEntries(form));

  if (!parsed.success) {
    return { message: parsed.error.message, status: "invalid" as const };
  }

  const result = await deleteReview({
    ctx,
    id: parsed.data.reviewId,
  });

  if (result.count <= 0) {
    return { status: "error" as const };
  }

  event.redirect(302, paths.reviews);
  return { status: "success" as const };
});

export const findReviewsAction = action$(async (form, event) => {
  const ctx = await getProtectedRequestContext(event);

  const parsed = z
    .object({
      skip: z.coerce.number().int().min(0).default(0),
      take: z.coerce.number().int().min(0).max(100).default(20),
    })
    .safeParse(formEntries(form));

  if (!parsed.success) {
    return { message: parsed.error.message, status: "invalid" as const };
  }

  const result = await findReviews({
    ctx,
    skip: parsed.data.skip,
    take: parsed.data.take,
  });

  return { status: "success" as const, ...result };
});

export default component$(() => {
  const collection = collectionLoader.use();
  const counts = countsLoader.use();
  const session = protectedSessionLoader.use();
  const findReviews = findReviewsAction.use();
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
          await findReviews.execute({
            skip: `${(store.currentPage + 1) * 20}`,
            take: `${20}`,
          });
          if (findReviews.value?.status === "success") {
            const newAlbums = findReviews.value?.reviews || [];
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
