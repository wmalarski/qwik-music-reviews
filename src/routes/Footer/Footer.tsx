import { component$ } from "@builder.io/qwik";

export const Footer = component$(() => {
  return (
    <footer class="p-16 flex flex-col gap-4">
      <a
        class="link text-lg"
        href="https://github.com/wmalarski/qwik-music-reviews"
        target="_blank"
      >
        Github
      </a>
      <a class="link text-lg" href="https://qwik.builder.io/" target="_blank">
        Made using Qwik City
      </a>
    </footer>
  );
});
