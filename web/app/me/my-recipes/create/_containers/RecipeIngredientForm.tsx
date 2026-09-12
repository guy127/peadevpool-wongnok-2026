import { Button, TextField } from "@/components/bases";
import { XIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";

const RecipeIngredientForm = () => {
  const [ingredients, setIngredients] = useState<string[]>([""]);

  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, ""]);
  };

  const handleRemoveIngredient = (index: number) => {
    let remainIngredients = [];
    const startIngredients = ingredients.slice(0, index);
    const endIngredients = ingredients.slice(index + 1);
    remainIngredients = [...startIngredients, ...endIngredients];
    setIngredients(remainIngredients);
  };

  const handleIngredientChange = (
    event: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    index: number,
  ) => {
    const value = event.target.value;
    const newIngredientValues = [...ingredients];
    newIngredientValues[index] = value;
    setIngredients(newIngredientValues);
  };

  return (
    <div className="mt-6">
      <div className="bg-white p-7 rounded-3xl">
        <p className="font-bold">Ingredients</p>
        <p className="wongnok-text-body text-muted-foreground">
          {`One per line, with the amount.`}
        </p>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-4 mt-6">
            <div className="p-2 w-6 h-6 wongnok-text-xs font-bold bg-primary-subtle text-primary relative rounded-4xl">
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {index + 1}
              </p>
            </div>
            <TextField
              name={`ingredient-${index + 1}`}
              placeholder={"e.g. 2 tbsp fish sauce"}
              className="w-full"
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, index)}
            />
            <Button
              type={"button"}
              variant={"outlined"}
              color={"error"}
              className={"p-2"}
              onClick={() => handleRemoveIngredient(index)}
            >
              <XIcon />
            </Button>
          </div>
        ))}
        <Button
          type={"button"}
          variant={"outlined"}
          className={"mt-6"}
          onClick={handleAddIngredient}
        >
          Add Ingredient
        </Button>
      </div>
    </div>
  );
};

export default RecipeIngredientForm;
