import Head from "next/head";

import "../styles/reset.css";

export default function TAMA({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TAMA</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Component {...pageProps} />
      <div className="author">
        2022 © ri1ken.&nbsp;
        <a href="https://twitter.com/Kiokh_" target="_blank">
          @Kiokh_
        </a>
        .&nbsp;
        <a href="https://github.com/kiotlin/tama" target="_blank">
          GitHub Repository
        </a>
        .
      </div>
    </>
  );
}
