import {
  component$,
  Slot,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import { withSession } from "~/server/auth/withSession";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { ContainerContext, useSessionContextProvider } from "./context";

export const onGet = endpointBuilder()
  .use(withSession())
  .resolver((event) => {
    return event.session;
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useSessionContextProvider(resource);

  const containerRef = useSignal<Element | null>(null);
  useContextProvider(ContainerContext, containerRef);

  return (
    <div class="flex h-screen w-screen flex-col-reverse md:flex-row">
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
      <div
        ref={(e) => (containerRef.value = e)}
        class="w-full overflow-y-scroll"
      >
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
