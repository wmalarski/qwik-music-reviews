import { component$, Resource, useSignal } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useAlbumContext } from "../context";

export const onPost = endpointBuilder()
  .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ request, trpc, params, response }) => {
    const formData = await request.formData();
    await trpc.review.createReview({
      albumId: params.albumId,
      rate: +(formData.get("rate") || "0"),
      text: (formData.get("text") as string) || "",
    });
    throw response.redirect(paths.album(params.albumId));
  });

export default component$(() => {
  const albumResource = useAlbumContext();
  // const navigate = useNavigate();

  const error = useSignal("");
  // const isLoading = useSignal(false);

  return (
    <Resource
      value={albumResource}
      onResolved={(data) => (
        <div class="p-8 flex flex-col gap-4">
          <h2 class="text-xl">Add review</h2>
          {data.album ? (
            <ReviewForm action={paths.albumReview(data.album.id)} />
          ) : null}
          <span>{error.value}</span>
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Review Album - Qwik Album Review",
};
