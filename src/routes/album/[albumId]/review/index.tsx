import { component$ } from "@builder.io/qwik";
import { DocumentHead, useLocation } from "@builder.io/qwik-city";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { useAlbumLoader } from "../layout";

export default component$(() => {
  const location = useLocation();

  const albumResource = useAlbumLoader();

  return (
    <div class="p-8 flex flex-col gap-4">
      <h2 class="text-xl">Add review</h2>
      {albumResource.value ? (
        <ReviewForm albumId={location.params.albumId} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Review Album - Qwik Album Review",
};
