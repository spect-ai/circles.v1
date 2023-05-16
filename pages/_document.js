import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import Script from "next/script";
import { GA_ANALYTICS_MEASUREMENT_ID } from "../lib/gtag";

const isProd = process.env.NODE_ENV === "production";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* enable analytics script only for production */}
          {isProd && (
            <>
              <Script
                strategy="lazyOnload"
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ANALYTICS_MEASUREMENT_ID}`}
              />
              <Script
                strategy="lazyOnload"
                async
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ANALYTICS_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
              />
              <Script
                src="//code.tidio.co/x1bt9qhixmj7iqkf50xb9bjc4zstsuws.js"
                async
              />
            </>
          )}
          <Script
            strategy="lazyOnload"
            async
            src="https://telegram.org/js/telegram-widget.js"
          />
          <Script
            strategy="lazyOnload"
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
