import { RecipeCard } from "@/components/RecipeMenu";

import RecipeCardFavoriteDemo from "../_components/RecipeCardFavoriteDemo";
import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseRecipeCard() {
  return (
    <ShowcaseSection
      id="recipe-card"
      title="Recipe card"
      description="4:3 photo, title at two lines max, owner row, then level and rating pinned to the bottom. Rating hides when the rating prop is omitted; the heart only renders when onFavorite is passed."
    >
      <ShowcaseExample
        label="basic · no image falls back to placeholder"
        code={`<RecipeCard
  name="Thai basil chicken with a crisp fried egg"
  level="EASY"
  owner={{ name: "John Doe" }}
/>`}
      >
        <RecipeCard
          className="w-full max-w-64"
          name="Thai basil chicken with a crisp fried egg"
          level="EASY"
          owner={{ name: "John Doe" }}
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="with image + rating"
        code={`<RecipeCard
  name="Grandmother's coconut pandan custard"
  imageUrl="https://picsum.photos/seed/pandan/640/480"
  level="HARD"
  owner={{
    name: "Luna Holland",
    imageUrl: "https://i.pravatar.cc/128?img=47",
  }}
  rating={{ rating: 4.8, ratingCount: 96 }}
/>`}
      >
        <RecipeCard
          className="w-full max-w-64"
          name="Grandmother's coconut pandan custard"
          imageUrl="https://picsum.photos/seed/pandan/640/480"
          level="HARD"
          owner={{
            name: "Luna Holland",
            imageUrl: "https://i.pravatar.cc/128?img=47",
          }}
          rating={{ rating: 4.8, ratingCount: 96 }}
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="favorite · click the heart"
        code={`const [isFavorite, setIsFavorite] = useState(false);

<RecipeCard
  name="Slow-simmered massaman beef curry"
  level="MEDIUM"
  owner={{ name: "Nok Charoen" }}
  rating={{ rating: 4.7, ratingCount: 188 }}
  isFavorite={isFavorite}
  onFavorite={() => setIsFavorite((current) => !current)}
/>`}
      >
        <RecipeCardFavoriteDemo />
      </ShowcaseExample>

      <ShowcaseExample
        label="interactive · Thai owner · broken image"
        code={`<RecipeCard
  interactive
  name="ต้มยำกุ้งน้ำข้น"
  imageUrl="/does-not-exist.png"
  level="EASY"
  owner={{ name: "อรนุมา ก." }}
  rating={{ rating: 0, ratingCount: 0 }}
/>`}
      >
        <RecipeCard
          interactive
          className="w-full max-w-64"
          name="ต้มยำกุ้งน้ำข้น"
          imageUrl="/does-not-exist.png"
          level="EASY"
          owner={{ name: "อรนุมา ก." }}
          rating={{ rating: 0, ratingCount: 0 }}
        />
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseRecipeCard;
export { ShowcaseRecipeCard };
