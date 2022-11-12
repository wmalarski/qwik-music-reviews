import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div>
      <h1>SignIn</h1>
      <a href="/api/auth/signin">SignIn</a>
    </div>
  );
});

export const head: DocumentHead = {
  title: "SignIn - Welcome to Qwik",
};
