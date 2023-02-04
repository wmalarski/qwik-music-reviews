import { component$, Slot } from "@builder.io/qwik";
import { Footer } from "./Footer/Footer";
import { Sidebar } from "./Sidebar/Sidebar";

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
