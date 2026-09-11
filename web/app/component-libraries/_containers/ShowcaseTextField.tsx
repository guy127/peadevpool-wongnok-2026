import { Search } from "lucide-react";

import { TextField } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseTextField() {
  return (
    <ShowcaseSection
      id="text-field"
      title="Text field"
      description="Defaults to size=medium (40px); size=large is the 46px form height. label and helperText render only when passed. errorMessage implies the error state and replaces helperText. startAdornment and endAdornment sit inside the focus ring. Any native input attribute — type, placeholder, defaultValue, required — passes through."
    >
      <ShowcaseExample label="default" code={`<TextField label="Name" />`}>
        <TextField label="Name" />
      </ShowcaseExample>

      <ShowcaseExample
        label="defaultValue"
        code={`<TextField label="Name" defaultValue="John Doe" />`}
      >
        <TextField label="Name" defaultValue="John Doe" />
      </ShowcaseExample>

      <ShowcaseExample
        label="type · number"
        code={`<TextField type="number" label="Price" defaultValue={120} />`}
      >
        <TextField type="number" label="Price" defaultValue={120} />
      </ShowcaseExample>

      <ShowcaseExample
        label="placeholder · helperText"
        code={`<TextField
  label="Recipe name"
  placeholder="Thai basil chicken"
  helperText="Shown on the recipe card."
/>`}
      >
        <TextField
          label="Recipe name"
          placeholder="Thai basil chicken"
          helperText="Shown on the recipe card."
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="startAdornment"
        code={`<TextField
  label="Search"
  placeholder="Search recipes…"
  startAdornment={<Search />}
/>`}
      >
        <TextField
          label="Search"
          placeholder="Search recipes…"
          startAdornment={<Search />}
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="endAdornment"
        code={`<TextField
  type="number"
  label="Cooking time"
  defaultValue={25}
  endAdornment="min"
/>`}
      >
        <TextField
          type="number"
          label="Cooking time"
          defaultValue={25}
          endAdornment="min"
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="both adornments"
        code={`<TextField
  type="number"
  label="Price"
  defaultValue={120}
  startAdornment="฿"
  endAdornment="THB"
/>`}
      >
        <TextField
          type="number"
          label="Price"
          defaultValue={120}
          startAdornment="฿"
          endAdornment="THB"
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="error · errorMessage"
        code={`<TextField
  type="number"
  label="Cooking time"
  defaultValue={0}
  helperText="Replaced by errorMessage."
  errorMessage="Give it at least 1 minute."
/>`}
      >
        <TextField
          type="number"
          label="Cooking time"
          defaultValue={0}
          helperText="Replaced by errorMessage."
          errorMessage="Give it at least 1 minute."
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="error · no errorMessage"
        code={`<TextField
  label="Recipe name"
  helperText="Shown on the recipe card."
  error
/>`}
      >
        <TextField
          label="Recipe name"
          helperText="Shown on the recipe card."
          error
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="disabled"
        code={`<TextField
  label="Email"
  defaultValue="mali.wong@email.com"
  helperText="Managed by your account."
  disabled
/>`}
      >
        <TextField
          label="Email"
          defaultValue="mali.wong@email.com"
          helperText="Managed by your account."
          disabled
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="sizes"
        code={`<TextField size="medium" label="Medium · 40px" />
<TextField size="large" label="Large · 46px" />`}
      >
        <TextField size="medium" label="Medium · 40px" />
        <TextField size="large" label="Large · 46px" />
      </ShowcaseExample>

      <ShowcaseExample
        label="no label"
        code={`<TextField placeholder="Search recipes…" aria-label="Search recipes" />`}
      >
        <TextField placeholder="Search recipes…" aria-label="Search recipes" />
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseTextField;
export { ShowcaseTextField };
