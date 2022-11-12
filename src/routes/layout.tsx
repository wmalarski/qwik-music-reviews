import { component$, Slot } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { withSession } from "~/server/auth/withSession";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { useSessionContextProvider } from "./context";

export const onGet = endpointBuilder()
  .use(withSession())
  .resolver((event) => {
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
              <a href={paths.home}>Home</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href={paths.search(0, "")}>Search</a>
            </li>
          </ul>
          <li>
            <ul>
              <a href={paths.nextSignOut}>Sing Out</a>
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
