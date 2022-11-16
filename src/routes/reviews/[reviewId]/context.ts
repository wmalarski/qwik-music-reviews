import {
  createContext,
  ResourceReturn,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import type { RouterOutput } from "~/utils/trpc";

type ReviewContextState = ResourceReturn<RouterOutput["review"]["findReview"]>;

const ReviewContext = createContext<ReviewContextState>("review-context");

export const useReviewContextProvider = (state: ReviewContextState) => {
  useContextProvider(ReviewContext, state);
};

export const useReviewContext = () => {
  return useContext(ReviewContext);
};
