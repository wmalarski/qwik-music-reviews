import { component$, useSignal, useStore } from "@builder.io/qwik";
import {
  routeLoader$,
  useLocation,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { ReviewList } from "~/modules/ReviewList/ReviewList";
import type { ReviewListItem } from "~/modules/ReviewList/ReviewListCard/ReviewListCard";
import { getProtectedRequestContext } from "~/server/auth/context";
import { countReviewsByDate, findReviews } from "~/server/data/review";
import { useSessionContextProvider } from "~/utils/SessionContext";
import { ReviewActivity } from "./ReviewActivity/ReviewActivity";

export const useProtectedSessionLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return ctx.session;
});

export const useCollectionLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return findReviews({ ctx, skip: 0, take: 20 });
});

export const useCountsLoader = routeLoader$(async (event) => {
  const ctx = await getProtectedRequestContext(event);
  return countReviewsByDate({ ctx });
});

export default component$(() => {
  const location = useLocation();

  const collection = useCollectionLoader();
  const counts = useCountsLoader();

  const session = useProtectedSessionLoader();
  useSessionContextProvider(session);

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
