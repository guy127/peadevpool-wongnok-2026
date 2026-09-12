import { Button, TextField } from "@/components/bases";
import { RecipeCreationFormValues } from "@/types/FormValues/recipeCreationForm";
import { XIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

const RecipeIngredientForm = () => {
  const { register, control } = useFormContext<RecipeCreationFormValues>();
  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control: control,
  });

  const handleAddIngredient = () => {
    append({ description: "" });
  };

  const handleRemoveIngredient = (index: number) => {
    remove(index);
  };

  return (
    <div className="mt-6">
      <div className="bg-white p-7 rounded-3xl">
        <p className="font-bold">Ingredients</p>
        <p className="wongnok-text-body text-muted-foreground">
          {`One per line, with the amount.`}
        </p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4 mt-6">
            <div className="p-2 w-6 h-6 wongnok-text-xs font-bold bg-primary-subtle text-primary relative rounded-4xl">
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {index + 1}
              </p>
            </div>
            <TextField
              {...register(`ingredients.${index}.description`)}
              placeholder={"e.g. 2 tbsp fish sauce"}
              className="w-full"
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
