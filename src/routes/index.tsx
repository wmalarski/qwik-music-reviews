import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";

export const onGet = async (event: RequestEvent) => {
  const { trpcServerCaller } = await import("~/server/trpc/router");
  const { caller } = await trpcServerCaller(event);

  return caller.album.findRandom();
};

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();

  return (
    <div>
      <h1>
        Random Albums <span class="bg-red-500">⚡️</span>
      </h1>
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
