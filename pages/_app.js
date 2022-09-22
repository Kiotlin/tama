import Head from "next/head";

import "../styles/reset.css";

export default function TAMA({ Component, pageProps }) {
  const meta = {
    title: "TAMA",
    description: "Beautiful 3d glass material balls in browser.",
    image: "https://tama.vercel.app/logo.png",
  };
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TAMA</title>
        <link rel="icon" href="/logo.svg" />
        <meta name="author" content="ri1ken" />
        <link rel="canonical" href="https://tama.vercel.app" />
        <meta name="title" content={meta.title} />
        <meta property="description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content="https://tama.vercel.app" />
        <meta
          property="og:image"
          content={meta.image || "https://tama.vercel.app/logo.png"}
        />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="@Kiokh_" />
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:description" content={meta.description} />
        <meta property="twitter:url" content="https://tama.vercel.app" />
        <meta
          property="twitter:image"
          content={meta.image || "https://tama.vercel.app/logo.png"}
        />
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
