import { Select } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

const LEVELS = [
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

const LEVELS_WITH_DOT = [
  {
    label: "Easy",
    value: "EASY",
    icon: <span className="size-2 rounded-full bg-success" />,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: <span className="size-2 rounded-full bg-accent" />,
  },
  {
    label: "Hard",
    value: "HARD",
    icon: <span className="size-2 rounded-full bg-destructive" />,
  },
];

function ShowcaseSelect() {
  return (
    <ShowcaseSection
      id="select"
      title="Select"
      description="A button that opens a popover list — never a native dropdown, so options can carry a colour dot and a check on the chosen row. options is required; each item can be disabled on its own. error turns the border red, and errorMessage replaces helperText underneath. Base UI form props (name, required, value/defaultValue, onValueChange) pass straight through to a hidden input."
    >
      <ShowcaseExample
        label="default"
        code={`<Select
  label="Level"
  options={[
    { label: "Easy", value: "EASY" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Hard", value: "HARD" },
  ]}
/>`}
      >
        <Select label="Level" options={LEVELS} />
      </ShowcaseExample>

      <ShowcaseExample
        label="empty options"
        code={`<Select label="Level" options={[]} />`}
      >
        <Select label="Level" options={[]} />
      </ShowcaseExample>

      <ShowcaseExample
        label="defaultValue"
        code={`<Select label="Level" options={LEVELS} defaultValue="MEDIUM" />`}
      >
        <Select label="Level" options={LEVELS} defaultValue="MEDIUM" />
      </ShowcaseExample>

      <ShowcaseExample
        label="placeholder"
        code={`<Select
  label="Level"
  options={LEVELS}
  placeholder="How hard is it?"
/>`}
      >
        <Select label="Level" options={LEVELS} placeholder="How hard is it?" />
      </ShowcaseExample>

      <ShowcaseExample
        label="helperText"
        code={`<Select
  label="Level"
  options={LEVELS}
  helperText="Pick the difficulty a first-timer would feel."
/>`}
      >
        <Select
          label="Level"
          options={LEVELS}
          helperText="Pick the difficulty a first-timer would feel."
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="option icon"
        code={`<Select
  label="Level"
  defaultValue="MEDIUM"
  options={[
    {
      label: "Easy",
      value: "EASY",
      icon: <span className="size-2 rounded-full bg-success" />,
    },
    // …
  ]}
/>`}
      >
        <Select label="Level" options={LEVELS_WITH_DOT} defaultValue="MEDIUM" />
      </ShowcaseExample>

      <ShowcaseExample
        label="disabled option"
        code={`<Select
  label="Level"
  options={[
    { label: "Easy", value: "EASY" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Hard", value: "HARD", disabled: true },
  ]}
/>`}
      >
        <Select
          label="Level"
          options={[
            { label: "Easy", value: "EASY" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Hard", value: "HARD", disabled: true },
          ]}
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="error · errorMessage"
        code={`<Select
  label="Level"
  options={LEVELS}
  helperText="Pick the difficulty a first-timer would feel."
  error
  errorMessage="Level is required."
/>`}
      >
        <Select
          label="Level"
          options={LEVELS}
          helperText="Pick the difficulty a first-timer would feel."
          error
          errorMessage="Level is required."
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="error · no errorMessage"
        code={`<Select
  label="Level"
  options={LEVELS}
  helperText="Pick the difficulty a first-timer would feel."
  error
/>`}
      >
        <Select
          label="Level"
          options={LEVELS}
          helperText="Pick the difficulty a first-timer would feel."
          error
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="disabled"
        code={`<Select
  label="Level"
  options={LEVELS}
  defaultValue="EASY"
  helperText="Locked while the recipe is under review."
  disabled
/>`}
      >
        <Select
          label="Level"
          options={LEVELS}
          defaultValue="EASY"
          helperText="Locked while the recipe is under review."
          disabled
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="name · required"
        code={`<Select label="Level" options={LEVELS} name="level" required />`}
      >
        <Select label="Level" options={LEVELS} name="level" required />
      </ShowcaseExample>

      <ShowcaseExample
        label="size"
        code={`<Select size="medium" label="Medium · 40px" options={LEVELS} />
<Select size="large" label="Large · 46px" options={LEVELS} />`}
      >
        <Select size="medium" label="Medium · 40px" options={LEVELS} />
        <Select size="large" label="Large · 46px" options={LEVELS} />
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseSelect;
export { ShowcaseSelect };
