import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent } from "@builder.io/qwik-city";
import { useSessionContext } from "./SessionContext";

export const onGet = async (event: RequestEvent) => {
  const { trpcServerCaller } = await import("~/server/trpc/router");
  const { caller } = await trpcServerCaller(event);

  return caller.album.findRandom();
};

export default component$(() => {
  const resource = useSessionContext();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="bg-red-500">⚡️</span>
      </h1>
      <a href="/app">Protected</a>
      <Resource
        value={resource}
        onPending={() => <span>Pending</span>}
        onRejected={() => <span>Rejected</span>}
        onResolved={(data) => (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
