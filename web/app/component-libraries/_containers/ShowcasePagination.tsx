import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcasePagination() {
  return (
    <ShowcaseSection
      id="pagination"
      title="Pagination"
      description="38px square controls, brand fill on the current page, ellipsis past five pages. Links wrap next/link; pass aria-disabled to Previous or Next at either end of the range."
    >
      <ShowcaseExample
        label="default"
        code={`<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#pagination" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#pagination" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseExample>

      <ShowcaseExample
        label="first page · previous disabled"
        code={`<PaginationItem>
  <PaginationPrevious href="#" aria-disabled />
</PaginationItem>
<PaginationItem>
  <PaginationLink href="#" isActive>
    1
  </PaginationLink>
</PaginationItem>
...
<PaginationItem>
  <PaginationNext href="#" />
</PaginationItem>`}
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#pagination" aria-disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">7</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#pagination" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseExample>

      <ShowcaseExample
        label="middle page · ellipsis both sides"
        code={`<PaginationItem>
  <PaginationLink href="#">1</PaginationLink>
</PaginationItem>
<PaginationItem>
  <PaginationEllipsis />
</PaginationItem>
<PaginationItem>
  <PaginationLink href="#" isActive>
    6
  </PaginationLink>
</PaginationItem>
<PaginationItem>
  <PaginationEllipsis />
</PaginationItem>
<PaginationItem>
  <PaginationLink href="#">12</PaginationLink>
</PaginationItem>`}
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#pagination" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination" isActive>
                6
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">7</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">12</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#pagination" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseExample>

      <ShowcaseExample
        label="last page · next disabled"
        code={`<PaginationItem>
  <PaginationLink href="#" isActive>
    7
  </PaginationLink>
</PaginationItem>
<PaginationItem>
  <PaginationNext href="#" aria-disabled />
</PaginationItem>`}
      >
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#pagination" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination">6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#pagination" isActive>
                7
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#pagination" aria-disabled />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcasePagination;
export { ShowcasePagination };
