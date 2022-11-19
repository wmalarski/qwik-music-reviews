import { z } from "zod";
import { withProtectedSession } from "~/server/auth/withSession";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { withTypedParams } from "~/utils/withTypes";

export const onPost = endpointBuilder()
  .use(withTypedParams(z.object({ albumId: z.string().min(1) })))
  .use(withProtectedSession())
  .use(withTrpc())
  .resolver(async ({ trpc, params, response }) => {
    const result = await trpc.album.deleteAlbum({
      id: params.albumId,
    });

    if (result.count <= 0) {
      throw response.redirect(paths.album(params.albumId));
    }

    throw response.redirect(paths.home);
  });
