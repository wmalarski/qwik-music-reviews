import { component$, Slot } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { withSession } from "~/server/auth/withSession";
import type { inferPromise } from "~/utils/types";
import { useSessionContextProvider } from "./SessionContext";

export const onGet = withSession((event) => {
  return event.session;
});

export default component$(() => {
  const resource = useEndpoint<inferPromise<typeof onGet>>();
  useSessionContextProvider(resource);

  return (
    <>
      <main>
        <section>
          <Slot />
        </section>
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});
