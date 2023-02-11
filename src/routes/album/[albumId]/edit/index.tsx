import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { albumLoader } from "../layout";
import { AlbumForm } from "./AlbumForm/AlbumForm";

export default component$(() => {
  const resource = albumLoader.use();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Edit album</h2>
      {resource.value.album ? (
        <AlbumForm initialValue={resource.value.album} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Edit Album - Qwik Album Review",
};
