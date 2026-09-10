"use client";

import { useState, type ComponentProps, type MouseEvent } from "react";
import Image from "next/image";

import { cva, type VariantProps } from "class-variance-authority";
import { CookingPot, Heart, Star } from "lucide-react";

import { Avatar, Badge, type BadgeProps } from "@/components/bases";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import RecipeRating, { RecipeCardRatingProps } from "./RecipeRating";

const RecipeLevel = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;

export type RecipeLevel = (typeof RecipeLevel)[keyof typeof RecipeLevel];

const RECIPE_LEVEL_LABEL: Record<RecipeLevel, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

/**
 * Fixed mapping — amber Easy, brand Medium, neutral Hard — so cooks read the
 * level by colour before they read the word.
 */
const RECIPE_LEVEL_COLOR: Record<
  RecipeLevel,
  NonNullable<BadgeProps["color"]>
> = {
  EASY: "accent",
  MEDIUM: "primary",
  HARD: "gray",
};

const recipeCardVariants = cva("h-full gap-0 py-0 ring-border", {
  variants: {
    interactive: {
      true: "cursor-pointer transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lg",
      false: "",
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

export type RecipeCardOwner = {
  name: string;
  imageUrl?: string;
};

export type RecipeCardProps = Omit<ComponentProps<typeof Card>, "children"> &
  VariantProps<typeof recipeCardVariants> & {
    name: string;
    imageUrl?: string;
    level: RecipeLevel;
    owner: RecipeCardOwner;
    rating?: RecipeCardRatingProps;
    isFavorite?: boolean;
    onFavorite?: () => void;
  };

function RecipeImagePlaceholder() {
  return (
    <div
      aria-hidden
      className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,var(--muted),var(--muted)_10px,var(--background)_10px,var(--background)_20px)]"
    >
      <CookingPot
        className="size-10 text-muted-foreground/50"
        strokeWidth={1.5}
      />
    </div>
  );
}

function RecipeCard({
  className,
  interactive = false,
  name,
  imageUrl,
  level,
  owner,
  rating,
  isFavorite = false,
  onFavorite,
  ...props
}: RecipeCardProps) {
  // Remember which URL failed rather than a boolean, so a new imageUrl gets a
  // fresh attempt instead of staying stuck on the placeholder.
  const [failedImageUrl, setFailedImageUrl] = useState<string>();
  const visibleImageUrl =
    imageUrl && imageUrl !== failedImageUrl ? imageUrl : undefined;

  const handleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    // The card is usually wrapped in a link; the heart must not navigate.
    event.preventDefault();
    event.stopPropagation();
    onFavorite?.();
  };

  return (
    <Card
      data-slot="recipe-card"
      className={cn(recipeCardVariants({ interactive, className }))}
      {...props}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {visibleImageUrl ? (
          <Image
            src={visibleImageUrl}
            alt={name}
            fill
            unoptimized
            className="object-cover"
            onError={() => setFailedImageUrl(visibleImageUrl)}
          />
        ) : (
          <RecipeImagePlaceholder />
        )}

        {onFavorite ? (
          <button
            type="button"
            data-slot="recipe-card-favorite"
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={handleFavorite}
            className="absolute top-2.5 right-2.5 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-card/90 text-secondary-foreground shadow-sm backdrop-blur-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.6,0.64,1)] outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-90 aria-pressed:scale-110 aria-pressed:text-primary"
          >
            <Heart
              aria-hidden
              className={cn("size-4.5", isFavorite && "fill-current")}
            />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="wongnok-text-h3 line-clamp-2 text-card-foreground">
          {name}
        </h3>

        <div className="flex min-w-0 items-center gap-2">
          <Avatar
            aria-hidden
            size="small"
            name={owner.name}
            imageUrl={owner.imageUrl}
          />
          <span className="wongnok-text-xs truncate text-muted-foreground">
            {owner.name}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <Badge color={RECIPE_LEVEL_COLOR[level]}>
            {RECIPE_LEVEL_LABEL[level]}
          </Badge>
          {rating ? <RecipeRating {...rating} /> : null}
        </div>
      </div>
    </Card>
  );
}

export default RecipeCard;
export { RecipeCard, RecipeLevel, recipeCardVariants };
