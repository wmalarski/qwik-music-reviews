import { component$, Slot } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { withProtectedSession } from "~/server/auth/withSession";
import { useSessionContextProvider } from "./SessionContext";

export const onGet = withProtectedSession((event) => {
  return event.session;
});

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useSessionContextProvider(resource);

  return (
    <>
      <main>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
          </ul>
          <li>
            <ul>
              <a href="/api/auth/signout">Sing Out</a>
            </ul>
          </li>
        </nav>
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
