export type RecipeCreationFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  level: string;
  time: string;
  ingredients: { description: string }[];
  instructions: { description: string }[];
};
