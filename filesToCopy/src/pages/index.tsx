import type { NextPage } from "next";
import styled, { keyframes } from "styled-components";
import { LifecycleWrapper, SASS } from "@techandtribal/maximilian";

const Layout = styled.div`
	${ SASS.flex.center };
	background-color: black;
	background: url("raiden.jpg") center/cover no-repeat;
	flex-direction: column;	
	height: 100%;
	width: 100%;
	
	.eyes {
		border-radius: 50%;
		height: 5px;
		left: 33.8%;
		position: absolute;
		top: 22.4%;
		width: 5px;
		z-index: 100000;

		animation: ${ keyframes`
			from { background-color: orange; }
			to {
				background-color: rgb(230,255,255, 1);
				width: 8px;
			}
		`} 1000ms 100ms ease-in-out alternate infinite;
	}
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
		height: 0;
		left: 0;
		top: 50%;
		width: 100%;

		animation: ${keyframes`
			to { height: 100px; }
		`} 500ms 2000ms ease-in-out forwards;

		.title0 {
			color: rgba(0,0,0,0);
			font-family: 'Gruppo', cursive;
			font-size: 10vw;
			text-transform: uppercase;
			
			animation:
				${ keyframes`
					to { color: color: #FFFFFF; }
				`} 1000ms 1000ms ease-in-out forwards,
				${ keyframes`
					0% { text-shadow: 0; }
					50% { text-shadow: 0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00; }
					0% { text-shadow: 0; }
				`} 1000ms 2200ms ease-in-out infinite;
		}

		.title1 {
			color: #FFFFFF;
			font-family: "Alegreya Sans", serif;
			letter-spacing: 3px;
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
			background-image: linear-gradient(#464d55, #25292e);
			border-radius: 8px;
			border-width: 0;
			box-shadow: 0 10px 20px rgba(0, 0, 0, .1),0 3px 6px rgba(0, 0, 0, .05);
			box-sizing: border-box;
			color: #fff;
			cursor: pointer;
			display: inline-flex;
			flex-direction: column;
			font-family: expo-brand-demi,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
			font-size: 18px;
			height: 52px;
			justify-content: center;
			line-height: 1;
			outline: none;
			overflow: hidden;
			padding: 0 32px;
			text-align: center;
			text-decoration: none;
			transform: translate3d(0, 0, 0);
			transition: all 150ms;
			vertical-align: baseline;
			white-space: nowrap;
	
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
	const HandleRegister = (i: number) => {
		console.log("Clicked " + i);
	};
	
	return(
		<LifecycleWrapper name="HomePage" { ...props }>
			<Layout>
				<div className="eyes" />
				<div className="titleContainer">
					<h1 className="title0">
						{ "R A I D E N" }
					</h1>
					<h3 className="title1">
						{ "Powered by Tech & Tribal" }
					</h3>
				</div>
				<div className="buttonContainer">
					<button className="button" onClick={ () => HandleRegister(0) }>
						{ "More Info" }
					</button>
					<button className="button" onClick={ () => HandleRegister(1) }>
						{ "Try Beta" }
					</button>
				</div>
			</Layout>
		</LifecycleWrapper>
	);
};

export default Home;
