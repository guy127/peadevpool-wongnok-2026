import { StarIcon } from "lucide-react";

const ratingCountFormat = new Intl.NumberFormat("en-US");

export type RecipeCardRatingProps = {
  rating?: number;
  ratingCount?: number;
};

function RecipeRating({ rating = 0, ratingCount = 0 }: RecipeCardRatingProps) {
  const score = rating.toFixed(1);
  const count = ratingCountFormat.format(ratingCount);

  return (
    <span
      data-slot="recipe-card-rating"
      className="flex shrink-0 items-center gap-1"
    >
      <StarIcon aria-hidden className="size-3.5 fill-accent text-accent" />
      <span
        aria-hidden
        className="wongnok-text-xs font-semibold text-secondary-foreground"
      >
        {score}
      </span>
      <span aria-hidden className="wongnok-text-xs text-muted-foreground">
        ({count})
      </span>
      <span className="sr-only">
        Rated {score} out of 5 from {count} reviews
      </span>
    </span>
  );
}

export default RecipeRating;
