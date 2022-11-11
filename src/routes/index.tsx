import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";

export const onGet = endpointBuilder()
  .use(withProtectedSession())
  .use(withTrpc())
  .query(({ trpc }) => {
    return trpc.album.findRandom();
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  return (
    <div>
      <h1>
        Random Albums <span class="bg-red-500">⚡️</span>
      </h1>
      <a href="/album/yolo">Album 1</a>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
