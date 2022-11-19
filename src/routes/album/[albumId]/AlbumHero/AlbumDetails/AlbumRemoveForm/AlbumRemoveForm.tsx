import { component$ } from "@builder.io/qwik";
import type { Album } from "@prisma/client";
import { Button } from "~/components/Button/Button";
import { paths } from "~/utils/paths";

type Props = {
  album: Album;
};

export const AlbumRemoveForm = component$<Props>((props) => {
  return (
    <form method="post" action={paths.albumRemove(props.album.id)}>
      <Button class="btn btn-sm uppercase" type="submit">
        Remove
      </Button>
    </form>
  );
});
