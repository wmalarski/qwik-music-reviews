import { component$, useSignal, useStore } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { withProtectedSession } from "~/server/auth/withSession";
import { countReviewsByDate, deleteReview, findReviews } from "~/server/review";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { protectedSessionLoader } from "../layout";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const collectionLoader = loader$(
  endpointBuilder()
    .use(withProtectedSession())
    .loader((event) => {
      return findReviews({ ctx: event.ctx, skip: 0, take: 20 });
    })
);

export const countsLoader = loader$(
  endpointBuilder()
    .use(withProtectedSession())
    .loader((event) => {
      return countReviewsByDate({ ctx: event.ctx });
    })
);

export const deleteReviewAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
    .use(withProtectedSession())
    .action(async (_form, event) => {
      const result = await deleteReview({
        ctx: event.ctx,
        id: event.params.reviewId,
      });

      if (result.count <= 0) {
        return;
      }

      throw event.redirect(302, paths.reviews);
    })
);

export const findReviewsAction = action$(
  endpointBuilder()
    .use(withProtectedSession())
    .action((form, event) => {
      const skip = +(form.get("skip") || 0);
      const take = +(form.get("take") || 20);
      return findReviews({ ctx: event.ctx, skip, take });
    })
);

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
          const newAlbums = findReviews.value?.reviews || [];
          store.currentPage = store.currentPage + 1;
          store.results = [...store.results, ...newAlbums];
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Reviews - Qwik Album Review",
};
