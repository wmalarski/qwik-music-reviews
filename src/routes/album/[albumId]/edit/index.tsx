import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead } from "@builder.io/qwik-city";
import { z } from "zod";
import { getProtectedRequestContext } from "~/server/auth/context";
import { updateAlbum } from "~/server/data/album";
import { formEntries } from "~/utils/form";
import { paths } from "~/utils/paths";
import { albumLoader } from "../layout";
import { AlbumForm } from "./AlbumForm/AlbumForm";

export const updateAlbumAction = action$(async (form, event) => {
  const ctx = await getProtectedRequestContext(event);
  const albumId = event.params.albumId;

  const parsed = z
    .object({
      title: z.string().optional(),
      year: z.coerce.number().min(0).max(2100).int().optional(),
    })
    .safeParse(formEntries(form));

  if (!parsed.success) {
    return { message: parsed.error.message, status: "invalid" as const };
  }

  await updateAlbum({
    ctx,
    id: albumId,
    title: parsed.data.title,
    year: parsed.data.year,
  });

  event.redirect(302, paths.album(albumId));

  return { status: "success" as const };
});

export default component$(() => {
  const resource = albumLoader.use();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Edit album</h2>
      {resource.value.album ? (
        <AlbumForm
          initialValue={resource.value.album}
          albumId={resource.value.album.id}
        />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Album - Qwik Album Review",
};
