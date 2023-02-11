import { component$, useTask$ } from "@builder.io/qwik";
import { action$, Form, useNavigate } from "@builder.io/qwik-city";
import { getProtectedRequestContext } from "~/server/auth/context";
import { deleteAlbum } from "~/server/data/album";
import { paths } from "~/utils/paths";

export const deleteAlbumAction = action$(async (_form, event) => {
  const ctx = await getProtectedRequestContext(event);
  const albumId = event.params.albumId;

  const result = await deleteAlbum({ ctx, id: albumId });

  if (result.count <= 0) {
    return event.fail(400, { formErrors: ["Album not found"] });
  }

  event.redirect(302, paths.home);
});

export const AlbumRemoveForm = component$(() => {
  const navigate = useNavigate();

  const action = deleteAlbumAction.use();

  useTask$(({ track }) => {
    const status = track(() => action.value?.status);
    if (status === "success") {
      navigate(paths.reviews);
    }
  });

  return (
    <Form action={action}>
      <pre>{JSON.stringify(action.value?.formErrors, null, 2)}</pre>
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});
