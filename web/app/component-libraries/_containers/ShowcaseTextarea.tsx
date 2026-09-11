import { Textarea } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseTextarea() {
  return (
    <ShowcaseSection
      id="textarea"
      title="Textarea"
      description="Shows 3 rows by default; pass rows to change it. Focus draws a 3px brand ring. error turns the border red, and errorMessage replaces helperText under the field. Any native textarea attribute passes through."
    >
      <ShowcaseExample
        label="default"
        code={`<Textarea label="Description" />`}
      >
        <Textarea label="Description" />
      </ShowcaseExample>

      <ShowcaseExample
        label="rows"
        code={`<Textarea label="Description" rows={5} />`}
      >
        <Textarea label="Description" rows={5} />
      </ShowcaseExample>

      <ShowcaseExample
        label="helperText"
        code={`<Textarea
  label="Description"
  placeholder="A weeknight stir-fry…"
  helperText="Tell people what makes this recipe yours."
/>`}
      >
        <Textarea
          label="Description"
          placeholder="A weeknight stir-fry…"
          helperText="Tell people what makes this recipe yours."
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="error · errorMessage"
        code={`<Textarea
  label="Description"
  helperText="Tell people what makes this recipe yours."
  error
  errorMessage="Description is required."
/>`}
      >
        <Textarea
          label="Description"
          helperText="Tell people what makes this recipe yours."
          error
          errorMessage="Description is required."
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="error · no errorMessage"
        code={`<Textarea
  label="Description"
  helperText="Tell people what makes this recipe yours."
  error
/>`}
      >
        <Textarea
          label="Description"
          helperText="Tell people what makes this recipe yours."
          error
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="disabled"
        code={`<Textarea
  label="Description"
  defaultValue="ผัดกะเพราไก่ สูตรคุณแม่"
  helperText="Locked while the recipe is under review."
  disabled
/>`}
      >
        <Textarea
          label="Description"
          defaultValue="ผัดกะเพราไก่ สูตรคุณแม่"
          helperText="Locked while the recipe is under review."
          disabled
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="no label"
        code={`<Textarea placeholder="Write a note…" aria-label="Note" />`}
      >
        <Textarea placeholder="Write a note…" aria-label="Note" />
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseTextarea;
export { ShowcaseTextarea };
