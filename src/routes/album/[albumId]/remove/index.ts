import { action$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";

export const deleteAlbumAction = action$(
  endpointBuilder()
    .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
    .use(withProtectedSession())
    .use(withTrpc())
    .action(async (_form, event) => {
      const albumId = event.params.albumId;

      const result = await event.trpc.album.deleteAlbum({
        id: albumId,
      });

      if (result.count <= 0) {
        throw event.redirect(302, paths.album(albumId));
      }

      throw event.redirect(302, paths.home);
    })
);
