// src/pages/404.js
import Link from 'next/link';

  const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '3rem', color: '#ff6347' }}>404 - Strona nie znaleziona</h1>
      <p>Przepraszamy, nie znaleźliśmy tej strony.</p>
      <Link href="/">
        <a style={{ color: '#0070f3', textDecoration: 'underline' }}>Wróć na stronę główną</a>
      </Link>
    </div>
  );
}

export default NotFound;