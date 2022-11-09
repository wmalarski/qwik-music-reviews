import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { useAlbumContext } from "./context";

export default component$(() => {
  const albumResource = useAlbumContext();

  return (
    <Resource
      value={albumResource}
      onPending={() => <span>Pending</span>}
      onRejected={() => <span>Rejected</span>}
      onResolved={(data) => (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
