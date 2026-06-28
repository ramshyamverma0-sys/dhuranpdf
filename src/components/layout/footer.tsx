import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { CATEGORIES } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg primary-gradient">
                <FileText className="h-4 w-4" />
              </span>
              <span className="font-bold">Dhuran <span className="text-primary">PDF</span></span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">All PDF & Smart AI Tools In One Place. 200+ free online tools.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Top Categories</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-primary transition">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">More Tools</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(6, 12).map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-primary transition">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} Dhuran PDF. All rights reserved.</span>
          <span>Built with care for the world.</span>
        </div>
      </div>
    </footer>
  );
}
