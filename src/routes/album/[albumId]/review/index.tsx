import { component$, Resource, useSignal } from "@builder.io/qwik";
import { DocumentHead, useNavigate } from "@builder.io/qwik-city";
import type { TRPCClientError } from "@trpc/client";
import { ReviewForm } from "~/modules/ReviewForm/ReviewForm";
import type { AppRouter } from "~/server/trpc/router";
import { paths } from "~/utils/paths";
import { trpc } from "~/utils/trpc";
import { useAlbumContext } from "../context";

export default component$(() => {
  const albumResource = useAlbumContext();
  const navigate = useNavigate();

  const error = useSignal("");
  const isLoading = useSignal(false);

  return (
    <Resource
      value={albumResource}
      onResolved={(data) => (
        <div class="p-8 flex flex-col gap-4">
          <h2 class="text-xl">Add review</h2>
          {data.album ? (
            <ReviewForm
              isLoading={isLoading.value}
              onSubmit$={async ({ text, rate }) => {
                try {
                  isLoading.value = true;
                  await trpc.review.createReview.mutate({
                    albumId: data.album.id,
                    rate,
                    text,
                  });
                  navigate.path = paths.album(data.album.id);
                } catch (err) {
                  const typedErr = err as TRPCClientError<AppRouter>;
                  error.value = typedErr.data?.code || "";
                } finally {
                  isLoading.value = false;
                }
              }}
            />
          ) : null}
          <span>{error.value}</span>
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Review Album - Qwik Album Review",
};
