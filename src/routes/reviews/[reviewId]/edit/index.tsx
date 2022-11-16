import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { z } from "zod";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useReviewContext } from "../context";

export const onPost = endpointBuilder()
  .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ request, trpc, params, response }) => {
    const formData = await request.formData();
    const year = formData.get("year");
    const title = formData.get("title");

    await trpc.album.updateAlbum({
      id: params.albumId,
      title: title ? (title as string) : undefined,
      year: year ? +year : undefined,
    });

    throw response.redirect(paths.album(params.albumId));
  });

export default component$(() => {
  const albumResource = useReviewContext();

  return (
    <Resource
      value={albumResource}
      onResolved={(data) => (
        <div class="p-8 flex flex-col gap-4">
          <h2 class="text-xl">Edit album</h2>
          {data ? (
            <ReviewForm action={location.pathname} initialValue={data} />
          ) : null}
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Edit Album - Qwik Album Review",
};
