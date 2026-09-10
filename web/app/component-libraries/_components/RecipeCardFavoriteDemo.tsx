"use client";

import { useState } from "react";

import { RecipeCard } from "@/components/RecipeMenu";

function RecipeCardFavoriteDemo() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <RecipeCard
      className="w-full max-w-64"
      name="Slow-simmered massaman beef curry"
      imageUrl="https://picsum.photos/seed/massaman/640/480"
      level="MEDIUM"
      owner={{ name: "Nok Charoen" }}
      rating={{ rating: 4.7, ratingCount: 188 }}
      isFavorite={isFavorite}
      onFavorite={() => setIsFavorite((current) => !current)}
    />
  );
}

export default RecipeCardFavoriteDemo;
export { RecipeCardFavoriteDemo };
