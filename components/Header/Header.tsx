import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-col gap-1">
      <Link href="/" className="flex items-center">
        <Image
          src="/Tally_DS_Logo.svg"
          alt="Tally Design System"
          width={210}
          height={33}
          className="h-8 w-auto"
          priority
        />
      </Link>
      <span className="text-xs font-medium text-muted-foreground">
        Version 1.5.0
      </span>
    </div>
  );
}
