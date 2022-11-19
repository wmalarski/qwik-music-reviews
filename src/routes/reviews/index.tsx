import { component$, Resource, useContext, useStore } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { trpc } from "~/utils/trpc";
import { withTypedQuery } from "~/utils/withTypes";
import { ContainerContext, useSessionContext } from "../context";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const onGet = endpointBuilder()
  .use(withTypedQuery(z.object({ page: z.number().min(0).step(1).optional() })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ query, trpc }) => {
    const [collection, counts] = await Promise.all([
      trpc.review.findReviews({
        skip: (query.page || 0) * 20,
        take: 20,
      }),
      trpc.review.countReviewsByDate(),
    ]);

    return { collection, counts };
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  const container = useContext(ContainerContext);
  const sessionResource = useSessionContext();

  const store = useStore({
    currentPage: 0,
    results: [] as ReviewListItem[],
  });

  return (
    <div>
      <h1>
        Reviews <span class="bg-red-500">⚡️</span>
      </h1>
      <Resource
        value={sessionResource}
        onResolved={(session) => {
          console.log({ session });
          return (
            <>
              <Resource
                value={resource}
                onPending={() => <span>Pending</span>}
                onRejected={() => <span>Rejected</span>}
                onResolved={(data) => {
                  console.log({ data, session });

                  return (
                    <>
                      <ReviewActivity counts={data.counts} />
                      <ReviewList
                        session={session}
                        collection={[
                          ...data.collection.reviews,
                          ...store.results,
                        ]}
                        currentPage={store.currentPage}
                        pageCount={Math.floor(data.collection.count / 20)}
                        parentContainer={container.value}
                        onMore$={async () => {
                          const newResult = await trpc.review.findReviews.query(
                            {
                              skip: (store.currentPage + 1) * 20,
                              take: 20,
                            }
                          );
                          const newAlbums = newResult?.reviews || [];
                          store.currentPage = store.currentPage + 1;
                          store.results = [...store.results, ...newAlbums];
                        }}
                      />
                    </>
                  );
                }}
              />
            </>
          );
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Reviews - Qwik Album Review",
};
