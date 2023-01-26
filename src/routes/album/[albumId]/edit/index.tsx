import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, useLocation } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useAlbumContext } from "../context";
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

      await event.trpc.album.updateAlbum({
        id: albumId,
        title: title ? (title as string) : undefined,
        year: year ? +year : undefined,
      });

      throw event.redirect(302, paths.album(albumId));
    })
);

export default component$(() => {
  const location = useLocation();
  const albumResource = useAlbumContext();

  return (
    <Resource
      value={albumResource}
      onResolved={(data) => (
        <div class="p-8 flex flex-col gap-4">
          <h2 class="text-xl">Edit album</h2>
          {data.album ? (
            <AlbumForm action={location.pathname} initialValue={data.album} />
          ) : null}
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Edit Album - Qwik Album Review",
};
