// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pl">
      <Head>
        {/* Skrypt autoblocker */}
        <script
          src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
          defer
        ></script>

        {/* Skrypt Usercentrics CMP */}
        <script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="pxHnWAYp8hC6ur"
          async
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
