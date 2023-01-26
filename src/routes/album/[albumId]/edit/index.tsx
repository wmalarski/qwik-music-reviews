import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, useLocation } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { updateAlbum } from "~/server/trpc/router/album";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { albumLoader } from "../layout";
import { AlbumForm } from "./AlbumForm/AlbumForm";

export const updateAlbumAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .action(async (form, event) => {
      const albumId = event.params.albumId;
      const year = form.get("year");
      const title = form.get("title");

      await updateAlbum({
        ctx: event.ctx,
        id: albumId,
        title: title ? (title as string) : undefined,
        year: year ? +year : undefined,
      });

      throw event.redirect(302, paths.album(albumId));
    })
);

export default component$(() => {
  const location = useLocation();
  const resource = albumLoader.use();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Edit album</h2>
      {resource.value.album ? (
        <AlbumForm
          action={location.pathname}
          initialValue={resource.value.album}
        />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Album - Qwik Album Review",
};
