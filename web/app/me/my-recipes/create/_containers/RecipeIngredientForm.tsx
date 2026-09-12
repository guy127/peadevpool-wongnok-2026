import { Button, TextField } from "@/components/bases";
import { XIcon } from "lucide-react";

const RecipeIngredientForm = () => {
  return (
    <div className="mt-6">
      <div className="bg-white p-7 rounded-3xl">
        <p className="font-bold">Ingredients</p>
        <p className="wongnok-text-body text-muted-foreground">
          {`One per line, with the amount.`}
        </p>
        {Array.from({ length: 3 }).map((_, index) => (
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
            />
            <Button
              type={"button"}
              variant={"outlined"}
              color={"error"}
              className={"p-2"}
            >
              <XIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeIngredientForm;
