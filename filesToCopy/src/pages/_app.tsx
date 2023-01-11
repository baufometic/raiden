import type { AppProps } from "next/app";
import styled from "styled-components";
import { GlobalResetComponent, SASS } from "@techandtribal/maximilian";
import "../../styles/fonts.css";

const AppLayout = styled.div`
	header, main, footer {
		overflow: hidden;
		position: relative;
		z-index: 1;
	}
	
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 50px 1fr 50px;
	height: 100%;
	width: 100%;
`;

const HeaderLayout = styled.header`
	${ SASS.flex.center };
	background-image: linear-gradient(
		to bottom,
		rgba(12,20,31, 1),
		#325355 95%
	);
	border-bottom: 2px solid #174f9e;
	color: rgb(230,255,255);
	flex-direction: row;
	height: 100%;
	width: 100%;

	.item {
		${ SASS.flex.center };
		border: 1px solid rgba(12,20,31, 0.3);
		cursor: pointer;
		font-family: 'Gruppo', cursive;
		height: 100%;
		text-transform: uppercase;
		transition: font-size 500ms;
		width: 100%;

		&:hover {
			font-size: 1.1rem;
		}
	}
`;

const Header = () => {
	return(
		<HeaderLayout>
			<div className="item">
				{ "Home" }
			</div>
			<div className="item">
				{ "Blog" }
			</div>
			<div className="item">
				{ "NPM" }
			</div>
			<div className="item">
				{ "Twitter" }
			</div>
			<div className="item">
				{ "GitHub" }
			</div>
		</HeaderLayout>
	);
};
/*================================================================================
END OF HEADER
================================================================================*/

const Main = styled.div`
	height: 100%;
	width: 100%;
`;
/*================================================================================
END OF MAIN
================================================================================*/

const FooterLayout = styled.footer`
	${ SASS.flex.center };
	background-image: linear-gradient(
		to bottom,
		rgba(12,20,31, 1),
		#325355 95%
	);
	border-top: 2px solid #174f9e;
	flex-direction: row;
	height: 100%;
	width: 100%;
	
	.item {
		color: rgb(230,255,255);
		font-family: 'Gruppo', cursive;
		text-transform: uppercase;
	}
`;
const Footer = () => (
	<FooterLayout>
		<div className="item">
			{ "Next Gen Market Analytics" }
		</div>
	</FooterLayout>
);
/*================================================================================
END OF FOOTER
================================================================================*/

const App = ({ Component, pageProps }: AppProps) => {
	return(
		<>
			<GlobalResetComponent appContainer="#__next"/>
			<AppLayout>
				<Header />
				<Main>
					<Component { ...pageProps } />
				</Main>
				<Footer />
			</AppLayout>
		</>
	);
};

export default App;
