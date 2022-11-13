import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { useAlbumContext } from "../context";

export default component$(() => {
  const albumResource = useAlbumContext();

  return (
    <Resource
      value={albumResource}
      onResolved={(data) => (
        <div>
          {data.album ? (
            <>
              <h2>Edit</h2>
            </>
          ) : null}
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Edit Album - Qwik Album Review",
};
