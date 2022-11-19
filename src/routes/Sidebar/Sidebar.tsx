import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { cva } from "class-variance-authority";
import { paths } from "~/utils/paths";

export const link = cva(
  "link no-underline hover:border-b-2 hover:border-gray-400",
  {
    defaultVariants: {
      isActive: false,
    },
    variants: {
      isActive: {
        false: "",
        true: "border-b-2 border-white",
      },
    },
  }
);

export const Sidebar = component$(() => {
  const location = useLocation();

  return (
    <nav class="border-r-2 border-base-300">
      <ul class="flex flex-col gap-6 px-4 py-8 h-full w-28 items-center">
        <li>
          <a
            class={link({ isActive: paths.home === location.pathname })}
            href={paths.home}
          >
            Home
          </a>
        </li>
        <li>
          <a
            class={link({ isActive: paths.search === location.pathname })}
            href={paths.search}
          >
            Search
          </a>
        </li>
        <li class="flex-grow">
          <a
            class={link({ isActive: paths.reviews === location.pathname })}
            href={paths.reviews}
          >
            Reviews
          </a>
        </li>
        <li>
          <a class={link()} href={paths.nextSignOut}>
            Sign Out
          </a>
        </li>
      </ul>
    </nav>
  );
});
