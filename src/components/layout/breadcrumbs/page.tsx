// components/Breadcrumbs.js

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

const Breadcrumbs = ({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) => {
  // Zmieniamy typ referencji na HTMLOListElement
  const breadcrumbsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (breadcrumbsRef.current) {
      // Przewinięcie na ostatni element
      breadcrumbsRef.current.scrollLeft = breadcrumbsRef.current.scrollWidth;
    }
  }, [breadcrumbs]);

  return (
    <nav aria-label="breadcrumb">
      <ol
        ref={breadcrumbsRef} // Typowanie ref do HTMLOListElement
        className="flex space-x-2 pb-4 text-sm overflow-x-auto whitespace-nowrap"
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={index}
            className={`flex items-center ${index === 0 ? 'ml-3' : ''} ${index === breadcrumbs.length - 1 ? 'pr-2' : ''}`}
          >
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
