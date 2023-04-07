import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
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
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ANALYTICS_MEASUREMENT_ID}`}
              />
              <script
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
              <script
                src="//code.tidio.co/x1bt9qhixmj7iqkf50xb9bjc4zstsuws.js"
                async
              />
            </>
          )}
          <script async src="https://telegram.org/js/telegram-widget.js" />
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
            // eslint-disable-next-line react/jsx-props-no-spreading
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
