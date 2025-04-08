// components/Breadcrumbs.js

import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

const Breadcrumbs = ({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex space-x-2 pb-4 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-slate-200">/</span>}
            {breadcrumb.href ? (
              <Link href={breadcrumb.href} className="text-slate-400">
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-black">{breadcrumb.label}</span> // Aktywny breadcrumb
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;