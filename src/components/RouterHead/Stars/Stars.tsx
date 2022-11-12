import { component$ } from "@builder.io/qwik";

type Props = {
  rating?: number;
};

export const Stars = component$((props: Props) => {
  const value = Math.round((props.rating || 0) * 10) / 10;

  return (
    <div class="relative flex flex-row items-center gap-2">
      <img src="/images/stars.png" class="h-3 w-20" alt="rating" />
      <img
        src="/images/stars-filled.png"
        class="absolute h-3 w-20"
        alt="rating"
        style={{ clipPath: `inset(0px ${100 - value * 10}% 0px 0px)` }}
      />
      <div class="text-sm opacity-80">{value}</div>
    </div>
  );
});
