import { component$, Resource, Slot } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { useSessionContext } from "~/routes/context";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useReviewContextProvider } from "./context";

export const onGet = endpointBuilder()
  .use(withTypedParams(z.object({ reviewId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ trpc, params, session, response }) => {
    const review = await trpc.review.findReview({ id: params.reviewId });

    if (review?.userId !== session.user?.id) {
      throw response.redirect(paths.home);
    }

    return review;
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useReviewContextProvider(resource);
  const sessionResource = useSessionContext();

  return (
    <div class="flex flex-col">
      <Resource
        value={resource}
        onResolved={(data) => (
          <Resource
            value={sessionResource}
            onResolved={(session) => (
              <>
                {data ? (
                  <pre>{JSON.stringify({ data, session }, null, 2)}</pre>
                ) : null}
              </>
            )}
          />
        )}
      />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Review - Qwik Album Review",
};
