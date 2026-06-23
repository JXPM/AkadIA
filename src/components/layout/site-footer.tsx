import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const columns = [
  {
    titre: "Produit",
    links: [
      { href: "/catalogue", label: "Catalogue" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/laboratoire", label: "Laboratoire IA" },
      { href: "/app/dashboard", label: "Espace apprenant" },
    ],
  },
  {
    titre: "Solutions",
    links: [
      { href: "/formateur", label: "Mode formateur" },
      { href: "/admin", label: "Administration" },
      { href: "/a-propos", label: "Entreprises" },
      { href: "/contact", label: "Nous contacter" },
    ],
  },
  {
    titre: "Ressources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Support" },
      { href: "/tarifs", label: "FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Le Learning Operating System intelligent qui transforme
              l&apos;apprentissage professionnel grâce à l&apos;IA.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.titre}>
              <h3 className="mb-3 text-sm font-semibold">{col.titre}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} AKADIA. Tous droits réservés.</p>
          <p>Conçu pour rivaliser avec les meilleurs LMS du monde.</p>
        </div>
      </div>
    </footer>
  );
}
