// app/api/proxy/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Pobieramy pełny URL z parametrów zapytania
  const fullUrl = decodeURIComponent(searchParams.get('url') || '');
  if (!fullUrl) {
    return NextResponse.json({ message: 'Missing URL parameter' }, { status: 400 });
  }



  try {
    // Wykonanie zapytania do zewnętrznego API z pełnym URL
    const apiResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer HESuhfk!@kj4c3#$*&dsa`,  // Dodajemy token Bearer
      },
    });

    // Sprawdzamy, czy odpowiedź jest OK
    if (!apiResponse.ok) {
      return NextResponse.json(await apiResponse.json(), { status: apiResponse.status });
    }

    // Odczytanie danych z odpowiedzi
    const data = await apiResponse.json();

    // Zwrócenie danych z proxy do klienta
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas pobierania danych z API:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
