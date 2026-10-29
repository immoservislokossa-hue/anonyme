// Pages regroupées sous « Apprendre » : une seule entrée dans les menus.
export const LEARN_PATHS = ["/apprendre", "/sujets", "/outils", "/methodes", "/serie", "/histoires", "/chroniques"];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/apprendre") return LEARN_PATHS.some((path) => pathname.startsWith(path));
  return pathname.startsWith(href);
}
