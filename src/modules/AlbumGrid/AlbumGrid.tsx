import { $, component$, useSignal, type PropFunction } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Album, Artist } from "@prisma/client";
import { Stars } from "~/components/Stars/Stars";
import { AlbumCover } from "~/modules/AlbumCover/AlbumCover";
import { AlbumLinks } from "~/modules/AlbumLinks/AlbumLinks";
import { formatAlbum } from "~/utils/format";
import { paths } from "~/utils/paths";

export type AlbumGridItem = Album & {
  artist: Artist;
  avg: number;
  reviews: number;
};

type AlbumGridCardProps = {
  album: AlbumGridItem;
};

export const AlbumGridCard = component$<AlbumGridCardProps>((props) => {
  const heading = formatAlbum({
    album: props.album,
    artist: props.album.artist,
  });

  return (
    <div class="w-64">
      <Link href={paths.album(props.album.id)}>
        <div class="transition-scale scale-95 duration-300 ease-in-out hover:scale-100">
          <AlbumCover album={props.album} />
        </div>
        <span>{heading}</span>
      </Link>
      <Link href={paths.albumReview(props.album.id)}>
        <Stars rating={props.album.avg} />
      </Link>
      <AlbumLinks album={props.album} />
    </div>
  );
});

type Props = {
  collection: AlbumGridItem[];
  currentPage: number;
  pageCount: number;
  onMore$?: PropFunction<() => void>;
  parentContainer?: Element | null;
};

export const AlbumGrid = component$<Props>((props) => {
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
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4 p-8"
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
    >
      {props.collection?.map((media) => (
        <AlbumGridCard key={media.id} album={media} />
      ))}
    </div>
  );
});
