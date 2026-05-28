import Link from "next/link";
import { socialStats } from "@/lib/data";

export default function TopBar() {
  return (
    <div className="hidden border-b border-border bg-surface md:block">
      <div className="magazine-container flex h-10 items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          {socialStats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-primary"
            >
              <span className="font-bold text-foreground">{stat.count}</span>{" "}
              {stat.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4 text-muted">
          <Link href="/#contact" className="hover:text-primary">
            Login
          </Link>
          <span className="text-border">|</span>
          <Link href="/#subscribe" className="hover:text-primary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
