import { component$, Slot } from "@builder.io/qwik";
import { loader$ } from "@builder.io/qwik-city";
import { withProtectedSession } from "~/server/auth/withSession";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { Footer } from "./Footer/Footer";
import { Sidebar } from "./Sidebar/Sidebar";

export const protectedSessionLoader = loader$(
  endpointBuilder()
    .use(withProtectedSession())
    .loader((event) => {
      return event.session;
    })
);

export default component$(() => {
  return (
    <div class="flex h-screen w-screen flex-col-reverse md:flex-row overflow-y-hidden">
      <Sidebar />
      <div class="w-full">
        <main>
          <Slot />
        </main>
        <Footer />
      </div>
    </div>
  );
});
