import Script from 'next/script'

export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXX');`}
      </Script>
      <h1>Mobile POS Dashboard (Next.js)</h1>
      <p>Manage merchants, terminals, products, and sales from your phone.</p>
    </main>
  )
}
