import { component$, Resource, useSignal, useStore } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { trpc } from "~/utils/trpc";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const onGet = endpointBuilder()
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ trpc, session }) => {
    const [collection, counts] = await Promise.all([
      trpc.review.findReviews({ skip: 0, take: 20 }),
      trpc.review.countReviewsByDate(),
    ]);

    return { collection, counts, session };
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

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
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <>
            <div class="px-8">
              <ReviewActivity counts={data.counts} />
            </div>
            <ReviewList
              session={data.session}
              collection={[...data.collection.reviews, ...store.results]}
              currentPage={store.currentPage}
              pageCount={Math.floor(data.collection.count / 20)}
              parentContainer={containerRef.value}
              onMore$={async () => {
                const newResult = await trpc.review.findReviews.query({
                  skip: (store.currentPage + 1) * 20,
                  take: 20,
                });
                const newAlbums = newResult?.reviews || [];
                store.currentPage = store.currentPage + 1;
                store.results = [...store.results, ...newAlbums];
              }}
            />
          </>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Reviews - Qwik Album Review",
};
