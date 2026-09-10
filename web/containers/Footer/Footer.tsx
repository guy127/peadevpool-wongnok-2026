import NextLink from "next/link";

import Logo from "@/containers/NavBar/Logo";

type FooterLink = {
  label: string;
  href: string;
};

const LEGAL_LINKS: FooterLink[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

const FOOTER_SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Recipes", href: "/recipes" },
      { label: "Favorites", href: "/favorites" },
      { label: "Create Recipe", href: "/recipes/create" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Profile", href: "/profile" },
      { label: "My Recipes", href: "/my-recipes" },
    ],
  },
  {
    title: "Legal",
    links: LEGAL_LINKS,
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-9 px-5 pt-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="dark" />
          <p className="mt-3.5 max-w-70 wongnok-text-sm text-background/60">
            Share your recipe, inspire a meal.
          </p>
        </div>

        {FOOTER_SECTIONS.map(({ title, links }) => (
          <div key={title}>
            <h2 className="mb-4 wongnok-text-label uppercase text-background">
              {title}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <NextLink
                    href={href}
                    className="wongnok-text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-9 flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-background/10 px-5 py-7">
        <p className="wongnok-text-xs text-muted-foreground">
          © {year} Wongnok. All rights reserved.
        </p>
        <nav aria-label="Legal" className="flex gap-4.5">
          {LEGAL_LINKS.map(({ label, href }) => (
            <NextLink
              key={href}
              href={href}
              className="wongnok-text-xs text-muted-foreground transition-colors hover:text-background"
            >
              {label}
            </NextLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
export { Footer };
