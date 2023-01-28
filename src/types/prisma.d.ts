import type {
  Album as PrismaAlbum,
  Artist as PrismaArtist,
  Review as PrismaReview,
} from "@prisma/client";

type MapDateToString<PropType> = PropType extends Date ? string : PropType;

type MapDateObject<T> = {
  [PropertyKey in keyof T]: MapDateToString<T[PropertyKey]>;
};

// Qwik is serializing dates correctly now
// this code is changing those dates to string
declare module "@prisma/client" {
  type Album = MapDateObject<PrismaAlbum>;
  type Artist = MapDateObject<PrismaArtist>;
  type Review = MapDateObject<PrismaReview>;
}
