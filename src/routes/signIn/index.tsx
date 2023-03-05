import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";

export default component$(() => {
  return (
    <div>
      <h1>SignIn</h1>
      <a href={paths.nextSignIn}>SignIn</a>
    </div>
  );
});

export const head: DocumentHead = {
  title: "SignIn - Welcome to Qwik",
};
