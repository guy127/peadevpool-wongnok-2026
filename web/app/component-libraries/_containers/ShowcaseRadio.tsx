"use client";

import { useState } from "react";

import { Radio, RadioGroup } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseRadio() {
  const [level, setLevel] = useState("easy");
  const [lastPicked, setLastPicked] = useState("—");
  const [agreed, setAgreed] = useState(false);

  return (
    <ShowcaseSection
      id="radio"
      title="Radio"
      description="RadioGroup owns the value — pass defaultValue for uncontrolled or value + onChange for controlled. size and variant set on the group apply to every Radio inside; a Radio can override them. label and helperText render only when passed. errorMessage implies the error state and replaces helperText. A Radio outside a group is driven by checked + onChange."
    >
      <ShowcaseExample
        label="default · defaultValue"
        code={`<RadioGroup name="level" defaultValue="easy" label="Difficulty">
  <Radio value="easy" id="level-easy" label="Easy" />
  <Radio value="medium" id="level-medium" label="Medium" />
  <Radio value="hard" id="level-hard" label="Hard" />
</RadioGroup>`}
      >
        <RadioGroup name="level" defaultValue="easy" label="Difficulty">
          <Radio value="easy" id="level-easy" label="Easy" />
          <Radio value="medium" id="level-medium" label="Medium" />
          <Radio value="hard" id="level-hard" label="Hard" />
        </RadioGroup>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · controlled"
        code={`const [level, setLevel] = useState("easy");

<RadioGroup
  variant="outlined"
  label="Difficulty"
  value={level}
  onChange={(value) => setLevel(value)}
  helperText={\`Selected: \${level}\`}
>
  <Radio value="easy" id="option-easy" label="Easy" />
  <Radio value="medium" id="option-medium" label="Medium" />
  <Radio value="hard" id="option-hard" label="Hard" />
</RadioGroup>`}
      >
        <RadioGroup
          variant="outlined"
          label="Difficulty"
          value={level}
          onChange={(value) => setLevel(value)}
          helperText={`Selected: ${level}`}
        >
          <Radio value="easy" id="option-easy" label="Easy" />
          <Radio value="medium" id="option-medium" label="Medium" />
          <Radio value="hard" id="option-hard" label="Hard" />
        </RadioGroup>
      </ShowcaseExample>

      <ShowcaseExample
        label="Radio onChange inside a group"
        code={`<RadioGroup
  defaultValue="rice"
  label="Serve with"
  helperText={\`Last picked: \${lastPicked}\`}
>
  <Radio value="rice" label="Rice" onChange={setLastPicked} />
  <Radio value="noodles" label="Noodles" onChange={setLastPicked} />
</RadioGroup>`}
      >
        <RadioGroup
          defaultValue="rice"
          label="Serve with"
          helperText={`Last picked: ${lastPicked}`}
        >
          <Radio value="rice" label="Rice" onChange={setLastPicked} />
          <Radio value="noodles" label="Noodles" onChange={setLastPicked} />
        </RadioGroup>
      </ShowcaseExample>

      <ShowcaseExample
        label="sizes"
        code={`<RadioGroup size="small" defaultValue="a">…</RadioGroup>
<RadioGroup size="medium" defaultValue="a">…</RadioGroup>
<RadioGroup size="large" defaultValue="a">…</RadioGroup>`}
      >
        {(["small", "medium", "large"] as const).map((size) => (
          <RadioGroup key={size} size={size} defaultValue="a" label={size}>
            <Radio value="a" label="Checked" />
            <Radio value="b" label="Unchecked" />
          </RadioGroup>
        ))}
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · sizes"
        code={`<RadioGroup variant="outlined" size="small" defaultValue="a">…</RadioGroup>
<RadioGroup variant="outlined" size="medium" defaultValue="a">…</RadioGroup>
<RadioGroup variant="outlined" size="large" defaultValue="a">…</RadioGroup>`}
      >
        {(["small", "medium", "large"] as const).map((size) => (
          <RadioGroup
            key={size}
            variant="outlined"
            size={size}
            defaultValue="a"
            label={size}
          >
            <Radio value="a" label="Checked" />
            <Radio value="b" label="Unchecked" />
          </RadioGroup>
        ))}
      </ShowcaseExample>

      <ShowcaseExample
        label="error · errorMessage"
        code={`<RadioGroup
  variant="outlined"
  label="Category"
  helperText="Replaced by errorMessage."
  errorMessage="Pick a category."
>
  <Radio value="thai" label="Thai" />
  <Radio value="japanese" label="Japanese" />
</RadioGroup>`}
      >
        <RadioGroup
          variant="outlined"
          label="Category"
          helperText="Replaced by errorMessage."
          errorMessage="Pick a category."
        >
          <Radio value="thai" label="Thai" />
          <Radio value="japanese" label="Japanese" />
        </RadioGroup>
      </ShowcaseExample>

      <ShowcaseExample
        label="error · no errorMessage"
        code={`<RadioGroup label="Category" helperText="Required." error>
  <Radio value="thai" label="Thai" />
  <Radio value="japanese" label="Japanese" />
</RadioGroup>`}
      >
        <RadioGroup label="Category" helperText="Required." error>
          <Radio value="thai" label="Thai" />
          <Radio value="japanese" label="Japanese" />
        </RadioGroup>
      </ShowcaseExample>

      <ShowcaseExample
        label="disabled"
        code={`<RadioGroup variant="outlined" defaultValue="a" label="Group disabled" disabled>
  <Radio value="a" label="Checked" />
  <Radio value="b" label="Unchecked" />
</RadioGroup>
<RadioGroup defaultValue="a" label="One item disabled">
  <Radio value="a" label="Available" />
  <Radio value="b" label="Sold out" disabled />
</RadioGroup>`}
      >
        <RadioGroup
          variant="outlined"
          defaultValue="a"
          label="Group disabled"
          disabled
        >
          <Radio value="a" label="Checked" />
          <Radio value="b" label="Unchecked" />
        </RadioGroup>
        <RadioGroup defaultValue="a" label="One item disabled">
          <Radio value="a" label="Available" />
          <Radio value="b" label="Sold out" disabled />
        </RadioGroup>
      </ShowcaseExample>

      <ShowcaseExample
        label="standalone · checked"
        code={`const [agreed, setAgreed] = useState(false);

<Radio
  value="agree"
  name="terms"
  label="I agree to the house rules"
  checked={agreed}
  onChange={() => setAgreed(true)}
/>`}
      >
        <Radio
          value="agree"
          name="terms"
          label="I agree to the house rules"
          checked={agreed}
          onChange={() => setAgreed(true)}
        />
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseRadio;
export { ShowcaseRadio };
