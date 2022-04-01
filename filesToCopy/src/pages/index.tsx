import type { NextPage } from "next";
import styled, { keyframes } from "styled-components";
import { LifecycleWrapper, SASS } from "@techandtribal/maximilian";
import { config, Div } from "@techandtribal/combronents";
config.logging = false; // default anyway, just a reminder that Combronents can log verbose

const Layout = styled.div`
	${ SASS.flex.center };
	background-color: black;
	background: url("raiden.jpg") center/cover no-repeat;
	flex-direction: column;
	height: 100%;
	width: 100%;
	
	.titleContainer {
		${ SASS.flex.center };
		background-image: linear-gradient(
			to bottom,
			rgba(12,20,31, 0),
			rgba(12,20,31, 0.8) 30%,
			rgba(12,20,31, 0.8) 70%,
			rgba(12,20,31, 0)
		);
		flex-direction: column;
		height: 20vw; // TODO make a var to hold this and font-size of .title so they are the same var
		left: 0;
		margin-bottom: 20px;
		top: 50%;
		transform: scaleY(0);
		width: 100%;

		animation: ${ keyframes`
			to {
				transform: scaleY(1);
			}
		` } 500ms 2000ms ease-in-out forwards;

		.title {
			color: rgba(0,0,0,0);
			font-family: 'Gruppo', cursive;
			font-size: 10vw;
			text-transform: uppercase;
			
			animation:
				${ keyframes`
					to { color: color: #FFFFFF; }
				` } 1000ms 1000ms ease-in-out forwards,
				${ keyframes`
					0% { text-shadow: 0; }
					50% { text-shadow: 0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00; }
					0% { text-shadow: 0; }
				` } 1000ms 2200ms ease-in-out infinite;
		}

		.subtitle {
			color: #FFFFFF;
			font-family: "Alegreya Sans", serif;
			letter-spacing: 3px;
			margin-top: 10px;
			text-align: center;
			text-shadow: 0 -1px 4px #5ba8b3, 0 -2px 10px #f1f1f1, 0 -10px 20px #1900ff, 0 -18px 40px #cf4f4f;
			text-transform: uppercase;
		}
	}

	.buttonContainer {
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;

		.button {
			margin: 0 10px;
		}

		.button {
			align-items: center;
			background-color: initial;
			background-image: linear-gradient(to right, #2379CF, #BFD2D9);
			border-radius: 8px;
			border-width: 0;
			box-sizing: border-box;
			color: #D0C4A5;
			cursor: pointer;
			display: inline-flex;
			flex-direction: column;
			font-family: 'Gruppo', cursive, expo-brand-demi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			font-size: 1rem;
			height: 52px;
			justify-content: center;
			line-height: 1;
			outline: none;
			overflow: hidden;
			padding: 0 26px;
			text-align: center;
			text-decoration: none;
			text-transform: uppercase;
			transform: translate3d(0, 0, 0);
			transition: all 150ms;
			vertical-align: baseline;
			white-space: nowrap;
	
			&:before {
				background-image: linear-gradient(#464d55, #25292e);
				border-radius: 8px;
				content: "";
				height: calc(100% - 4px); // this and height must follow border-width or parent
				left: 50%;
				position: absolute;
				transform: translate(-50%, -50%);
				top: 50%;
				width: calc(100% - 4px);
				z-index: -1;
			}

			&:hover {
				box-shadow: rgba(0, 1, 0, .2) 0 2px 8px;
				opacity: .85;
			}
	
			&:active {
				outline: 0;
			}
	
			&:focus {
				box-shadow: rgba(0, 0, 0, .5) 0 0 0 3px;
			}
	
			@media (max-width: 420px) {
				height: 48px;
			}
		}
	}
`;

const Home: NextPage = (props) => {
	return(
		<LifecycleWrapper name="HomePage" { ...props }>
			<Layout>
				<Div h_full w_full />
				<div className="titleContainer">
					<h1 className="title">
						{ "R A I D E N" }
					</h1>
					<h3 className="subtitle">
						{ "Powered by Tech & Tribal" }
					</h3>
				</div>
				<div className="buttonContainer">
					<button className="button">
						{ "About" }
					</button>
					<button className="button">
						{ "Create" }
					</button>
				</div>
			</Layout>
		</LifecycleWrapper>
	);
};

export default Home;
