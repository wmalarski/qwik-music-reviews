import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import { useAlbumContext } from "../context";

export default component$(() => {
  const albumResource = useAlbumContext();

  return (
    <Resource
      value={albumResource}
      onResolved={(data) => (
        <div>
          {data.album ? (
            <ReviewForm
              isLoading={false}
              onSubmit$={() => {
                //
              }}
            />
          ) : null}
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Review Album - Qwik Album Review",
};
