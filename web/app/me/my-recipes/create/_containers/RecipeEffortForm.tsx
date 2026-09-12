import { Radio, RadioGroup, Select } from "@/components/bases";

const recipeLevelOptions = [
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

const RecipeEffortForm = () => {
  return (
    <div className="mt-6">
      <div className="bg-white p-7 rounded-3xl">
        <p className="font-bold">Effort</p>
        <p className="wongnok-text-body text-muted-foreground">
          {`Helps cooks pick something that fits their evening.`}
        </p>
        <div className="flex w-full gap-6 mt-6">
          <div className={"flex-1 shrink-0"}>
            <Select
              name={"level"}
              label={"Menu Level of Recipe"}
              options={recipeLevelOptions}
              required
              placeholder={"Select level of recipe"}
            />
          </div>
          <div className={"flex-1 shrink-0"}>
            <RadioGroup
              name="time"
              label={"Time to Make"}
              defaultValue={"JUST_MINUTES"}
              // orientation={"horizontal"}
              variant={"outlined"}
              className={"grid grid-cols-2"}
              required
            >
              <Radio label={"5 - 10 mins"} value={"JUST_MINUTES"} />
              <Radio label={"10 - 30 mins"} value={"HALF_HOUR"} />
              <Radio label={"~1 hour"} value={"ABOUT_HOUR"} />
              <Radio label={"More than 1 hour"} value={"MORE_THAN_HOUR"} />
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeEffortForm;
