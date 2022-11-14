import { component$, Slot } from "@builder.io/qwik";
import type { JSX } from "@builder.io/qwik/jsx-runtime";
import { cva, type VariantProps } from "class-variance-authority";

export const button = cva("btn uppercase", {
  defaultVariants: {
    isLoading: false,
  },
  variants: {
    isLoading: {
      false: "",
      true: "loading",
    },
  },
});

export type ButtonProps = JSX.IntrinsicElements["button"] &
  VariantProps<typeof button>;

export const Button = component$<ButtonProps>(
  ({ className, isLoading, ...props }) => {
    return (
      <button class={button({ className, isLoading })} {...props}>
        <Slot />
      </button>
    );
  }
);
