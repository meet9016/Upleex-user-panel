import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-slate-500 font-medium mb-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
      <Link href="/" className="flex items-center hover:text-upleex-purple transition-colors">
        <Home size={16} className="mr-1" />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={16} className="mx-2 text-slate-400 flex-shrink-0" />
          {item.href && index !== items.length - 1 ? (
            <Link href={item.href} className="hover:text-upleex-purple transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-upleex-purple font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
