"use client";

import { Button } from "@/components/bases";
import RecipeTheDishForm from "./_containers/RecipeTheDishForm";
import RecipeEffortForm from "./_containers/RecipeEffortForm";
import RecipeIngredientForm from "./_containers/RecipeIngredientForm";
import RecipeInstructionForm from "./_containers/RecipeInstructionForm";

const RecipeCreationPage = () => {
  const handleSubmit = () => {
    console.log("SUBMITTED");
  };

  return (
    <div className="px-4 py-8">
      <h1 className="wongnok-text-h2">Create Recipe</h1>
      <form onSubmit={handleSubmit}>
        <RecipeTheDishForm />
        <RecipeEffortForm />
        <RecipeIngredientForm />
        <RecipeInstructionForm />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default RecipeCreationPage;
