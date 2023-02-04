import { component$, useTask$ } from "@builder.io/qwik";
import { Form, useNavigate } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { deleteAlbumAction } from "../../../layout";

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
      <pre>{JSON.stringify(action.fail, null, 2)}</pre>
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});
