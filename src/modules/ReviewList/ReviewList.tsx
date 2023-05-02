import { $, component$, useSignal, type PropFunction } from "@builder.io/qwik";
import { Form, Link, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import type { Album, Artist, Review } from "@prisma/client";
import { Stars } from "~/components/Stars/Stars";
import { AlbumCover } from "~/modules/AlbumCover/AlbumCover";
import { AlbumLinks } from "~/modules/AlbumLinks/AlbumLinks";
import { getProtectedRequestContext } from "~/server/auth/context";
import { deleteReview } from "~/server/data/review";
import { useSessionContext } from "~/utils/SessionContext";
import { formatAlbum } from "~/utils/format";
import { paths } from "~/utils/paths";

export const useDeleteReviewAction = globalAction$(
  async (data, event) => {
    const ctx = await getProtectedRequestContext(event);

    const result = await deleteReview({ ctx, ...data });

    if (result.count <= 0) {
      return event.fail(400, {
        formErrors: ["No review found"],
      });
    }
  },
  zod$({
    id: z.string(),
  })
);

type ReviewRemoveFormProps = {
  review: Review;
};

export const ReviewRemoveForm = component$<ReviewRemoveFormProps>((props) => {
  const action = useDeleteReviewAction();

  return (
    <Form action={action}>
      <input type="hidden" name="id" value={props.review.id} />
      <button class="btn btn-sm uppercase" type="submit">
        Remove
      </button>
    </Form>
  );
});

export type ReviewListItem = Review & {
  album: Album & {
    artist: Artist;
  };
};

type ReviewListCardProps = {
  review: ReviewListItem;
};

export const ReviewListCard = component$<ReviewListCardProps>((props) => {
  const session = useSessionContext();

  const heading = formatAlbum({
    album: props.review.album,
    artist: props.review.album.artist,
  });

  return (
    <div class="flex flex-row">
      <Link href={paths.album(props.review.album.id)} class="w-64">
        <div class="transition-scale scale-95 duration-300 ease-in-out hover:scale-100">
          <AlbumCover album={props.review.album} />
        </div>
      </Link>
      <div class="flex flex-col">
        <Link href={paths.album(props.review.album.id)} class="w-64">
          {heading}
        </Link>
        <Stars rating={props.review.rate} />
        {session.value.user?.id === props.review.userId && (
          <>
            <Link class="link" href={paths.reviewEdit(props.review.id)}>
              Edit
            </Link>
            <ReviewRemoveForm review={props.review} />
          </>
        )}
        <AlbumLinks album={props.review.album} />
      </div>
    </div>
  );
});

type Props = {
  collection: ReviewListItem[];
  currentPage: number;
  onMore$?: PropFunction<() => void>;
  pageCount: number;
  parentContainer?: Element | null;
};

export const ReviewList = component$<Props>((props) => {
  const parentContainer = props.parentContainer;
  const onMore$ = props.onMore$;
  const currentPage = props.currentPage;
  const pageCount = props.pageCount;

  const throttleTimer = useSignal(false);
  const scrollEnabled = useSignal(currentPage < pageCount);

  const handleScroll$ = $(() => {
    if (!parentContainer) {
      return;
    }

    const endOfPage =
      parentContainer.clientHeight + parentContainer.scrollTop >=
      parentContainer.scrollHeight - 100;

    if (endOfPage) {
      onMore$?.();
    }

    if (currentPage === pageCount) {
      scrollEnabled.value = false;
    }
  });

  return (
    <section>
      <div
        document:onScroll$={() => {
          if (throttleTimer.value || !scrollEnabled.value) {
            return;
          }
          throttleTimer.value = true;
          setTimeout(() => {
            handleScroll$();
            throttleTimer.value = false;
          }, 1000);
        }}
        class="grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-4 p-8"
      >
        {props.collection?.map((review) => (
          <ReviewListCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
});
