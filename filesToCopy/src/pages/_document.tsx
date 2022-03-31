import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document";
import { ServerStyleSheet } from "styled-components";

const siteInfo = {
	colour      : "#4B4A69",
	description : "Site built by Raiden",
	email       : "info@techandtribal.com",
	name        : "TECH & TRIBAL",
	url         : "https://techandtribal.com",
} as const;

// eslint-disable-next-line no-console
console.log(`%c  ${ siteInfo.name }  %c  ${ siteInfo.description }  %c  ${ siteInfo.url }`,
	"background-color: black; color: orange; font-size: 16px; text-align: center;",
	"background-color: black; color: lime; font-size: 16px; text-align: center;",
	"background-color: black; color: orange; font-size: 16px; text-align: center;");

// eslint-disable-next-line no-console
console.log(`%c ENV: ${ (process.env.NODE_ENV).toUpperCase() }`,
	"background-color: black; color: gold; font-size: 14px; margin: 5px;");

export default class MyDocument extends Document {
	static async getInitialProps(
		ctx: DocumentContext
	): Promise<DocumentInitialProps> {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						sheet.collectStyles(<App { ...props } />),
				});

			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{ initialProps.styles }
						{ sheet.getStyleElement() }
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return(
			<Html lang="en">
				<Head>
					<meta property="og:title" content={ siteInfo.name } />
					<meta name="description" content={ siteInfo.description } />
					<meta property="og:description" content={ siteInfo.description } />
					<meta property="og:url" content={ siteInfo.url } />
					<meta property="og:type" content="website" />
					<link rel="icon" href="/favicon.ico" />
					<link rel="apple-touch-icon" href="/favicon.ico" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="theme-color" content={ siteInfo.colour } />
					<meta name="msapplication-TileColor" content={ siteInfo.colour } />
					<meta name="msapplication-navbutton-color" content={ siteInfo.colour } />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content={ siteInfo.colour } />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
