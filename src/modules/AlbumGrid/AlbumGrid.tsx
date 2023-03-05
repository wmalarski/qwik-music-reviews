import { $, component$, useSignal, type PropFunction } from "@builder.io/qwik";
import {
  AlbumGridCard,
  type AlbumGridItem,
} from "./AlbumGridCard/AlbumGridCard";

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
