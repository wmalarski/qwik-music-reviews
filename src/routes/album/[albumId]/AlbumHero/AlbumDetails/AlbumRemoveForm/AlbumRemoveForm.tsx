import { component$ } from "@builder.io/qwik";
import { action$, Form, useLocation, z, zod$ } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { deleteAlbum } from "~/server/data/album";
import { paths } from "~/utils/paths";

export const deleteAlbumAction = action$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    const result = await deleteAlbum({ ctx, ...data });

    if (result.count <= 0) {
      return event.fail(400, { formErrors: ["Album not found"] });
    }

    event.redirect(302, paths.home);
  },
  zod$({
    id: z.string(),
  })
);

export const AlbumRemoveForm = component$(() => {
  const location = useLocation();

  const action = deleteAlbumAction.use();

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={location.params.albumId} />
      <pre>{JSON.stringify(action.value?.formErrors, null, 2)}</pre>
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});
