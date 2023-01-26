import { component$, useSignal, useStore } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useTrpcContext } from "../context";
import { protectedSessionLoader } from "../layout";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const collectionLoader = loader$(
  endpointBuilder()
    .use(withProtectedSession())
    .use(withTrpc())
    .loader((event) => {
      return event.trpc.review.findReviews({
        skip: 0,
        take: 20,
      });
    })
);

export const countsLoader = loader$(
  endpointBuilder()
    .use(withProtectedSession())
    .use(withTrpc())
    .loader((event) => {
      return event.trpc.review.countReviewsByDate();
    })
);

export const deleteReviewAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .action(async (_form, event) => {
      const result = await event.trpc.review.deleteReview({
        id: event.params.reviewId,
      });

      if (result.count <= 0) {
        return;
      }

      throw event.redirect(302, paths.reviews);
    })
);

export default component$(() => {
  const collection = collectionLoader.use();
  const counts = countsLoader.use();
  const session = protectedSessionLoader.use();

  const trpcContext = useTrpcContext();
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
        collection={[...collection.value.reviews, ...store.results]}
        currentPage={store.currentPage}
        pageCount={Math.floor(collection.value.count / 20)}
        parentContainer={containerRef.value}
        onMore$={async () => {
          const trpc = await trpcContext();
          const newResult = await trpc?.review.findReviews.query({
            skip: (store.currentPage + 1) * 20,
            take: 20,
          });
          const newAlbums = newResult?.reviews || [];
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
