import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Desthetik - System Design Agent</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Generate world-class system designs in seconds" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp 