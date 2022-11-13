import { component$, Resource, Slot } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { z } from "zod";
import { AlbumHero } from "~/modules/AlbumHero/AlbumHero";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";
import { useAlbumContextProvider } from "./context";

export const onGet = endpointBuilder()
  .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(({ trpc, params }) => {
    return trpc.album.findAlbum({ id: params.albumId });
  });

export default component$(() => {
  const resource = useEndpoint<typeof onGet>();
  useAlbumContextProvider(resource);

  return (
    <div>
      <Resource
        value={resource}
        onResolved={(data) => (
          <>
            {data.album ? (
              <div class="flex flex-col">
                <AlbumHero album={data.album} />
                <nav>
                  <ul class="w-full flex flex-row justify-center gap-8">
                    <li>
                      <a class="text-xl" href={paths.album(data.album.id)}>
                        Details
                      </a>
                    </li>
                    <li>
                      <a class="text-xl" href={paths.albumEdit(data.album.id)}>
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        class="text-xl"
                        href={paths.albumReview(data.album.id)}
                      >
                        Review
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            ) : null}
          </>
        )}
      />
      <Slot />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Album - Qwik Album Review",
};
