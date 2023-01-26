import { component$, Resource, useSignal, useStore } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { useTrpcContext } from "../context";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const sessionLoader = loader$(
  endpointBuilder()
    .use(withProtectedSession())
    .loader((event) => {
      return event.session;
    })
);

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

export default component$(() => {
  const collection = collectionLoader.use();
  const counts = countsLoader.use();
  const session = sessionLoader.use();

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
      <Resource
        value={collection}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <>
            <div class="px-8">
              <ReviewActivity counts={counts.value} />
            </div>
            <ReviewList
              session={session.value}
              collection={[...data.reviews, ...store.results]}
              currentPage={store.currentPage}
              pageCount={Math.floor(data.count / 20)}
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
          </>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Reviews - Qwik Album Review",
};
