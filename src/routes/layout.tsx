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
    <div class="flex h-screen w-screen flex-col-reverse md:flex-row overflow-y-hidden">
      <nav>
        <ul>
          <li>
            <a href={paths.home}>Home</a>
          </li>
        </ul>
        <ul>
          <li>
            <a href={paths.search}>Search</a>
          </li>
        </ul>
        <ul>
          <li>
            <a href={paths.reviews}>Reviews</a>
          </li>
        </ul>
        <li>
          <ul>
            <a href={paths.nextSignOut}>Sing Out</a>
          </ul>
        </li>
      </nav>
      <div class="w-full">
        <main>
          <Slot />
        </main>
        <footer>
          <a href="https://www.builder.io/" target="_blank">
            Made with ♡ by Builder.io
          </a>
        </footer>
      </div>
    </div>
  );
});
