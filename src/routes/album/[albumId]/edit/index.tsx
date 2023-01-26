import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, useLocation } from "@builder.io/qwik-city";
import { z } from "zod";
import { updateAlbum } from "~/server/album";
import { protectedAlbumProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";
import { albumLoader } from "../layout";
import { AlbumForm } from "./AlbumForm/AlbumForm";

export const updateAlbumAction = action$(
  protectedAlbumProcedure.typedAction(
    z.object({
      title: z.string().optional(),
      year: z.coerce.number().min(0).max(2100).int().optional(),
    }),
    async (form, event) => {
      const albumId = event.typedParams.albumId;

      await updateAlbum({
        ctx: event.ctx,
        id: albumId,
        title: form.title,
        year: form.year,
      });

      throw event.redirect(302, paths.album(albumId));
    }
  )
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
