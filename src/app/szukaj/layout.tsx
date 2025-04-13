"use client";
import React from 'react';
import { useSearchParams } from "next/navigation";

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || ''; // Pobieramy parametr 'q' lub ustawiamy domyślną wartość

    return (
        <>
            {/* Dodajemy meta dane do head */}
            <head>
                <meta name="description" content={query} />
                <title>Wyniki wyszukiwania dla: {query}</title>
            </head>

            <main>{children}</main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Your Company</p>
            </footer>
        </>
    );
}