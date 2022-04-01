#!/usr/bin/env node
//import "./task_runner_build.js";

/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import events from "events";
import readline from "readline";
import colors from "colors"; // * used as: console.log("message".magenta);
import { createRequire } from "module";
import { version as raidenVersion } from "../package.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const emitter = new events.EventEmitter();
const require = createRequire(import.meta.url); // not avail otherwise

const IS_DEV_MODE = false;

//#region //*____________________ HELPER FUNCTIONS ____________________
const RandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const Sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MoveCursorToStart = () => (process.stdout.moveCursor(-1000, 0));
const MoveCursorToNewLine = () => (process.stdout.moveCursor(-1000, 1));

const FlashingText = async(text) => {
	MoveCursorToNewLine();

	for (let idx = 0; idx < 3; idx++) {
		process.stdout.write(text.cyan);
		await Sleep(150);
		process.stdout.clearLine();
		MoveCursorToStart();
		process.stdout.write("");
		await Sleep(50);
	}

	MoveCursorToStart();
	process.stdout.write(text.cyan);
	process.stdout.moveCursor(-1000, 2);
};

const Run = (cmd, cwd) => new Promise((resolve, reject) => {
	if (IS_DEV_MODE) console.log("[Run] cmd: " + cmd + " // dir: " + cwd);
	const commands = cmd.split(" ");
	const stdoutLogs = [], stderrLogs = [];

	//* SPAWN TAKES ARGS 1) cmd, args, cwd (dir) i.e. node -v  thisdirectory
	const task = spawn(
		commands[0],
		commands.flatMap((c, idx) => idx? c : []),
		{ cwd: cwd || "" }
	);
	
	//* PUSH STREAMING DATA TO ARRAYS IN CHUNKS
	task.stdout.on("data", d => {
		stdoutLogs.push(d); // * Regular data
	});
	task.stderr.on("data", d => {
		stderrLogs.push(d); // * Errors
	});
	task.on("exit", () => {
		// * If stdoutLogs contains data, log it
		if (stdoutLogs.length && IS_DEV_MODE) console.log(stdoutLogs.map(s => s).join("\n"));
		// * Same with error logs
		if (stderrLogs.length) console.log(`[stderrLogs]: ${ stderrLogs.map(s => s).join("\n") }`);
		
		// * Function should return the value retrieved from the command line
		resolve(stdoutLogs);
	});
});

//const RunASync = async(cmd, cwd) => Run(cmd, cwd);
//#endregion
/*================================================================================
END OF HELPER FUNCTIONS
================================================================================*/

const TASKS = {
	INTRO_COMPLETE         : "intro-complete",
	CHECKS_COMPLETE        : "checks-complete",
	INIT_COMPLETE          : "init-complete",
	PACKAGE_JSON_UPDATED   : "package-json-updated",
	FILES_COPIED           : "files-copied",
	GIT_INITIALISED        : "git-initialised",
	DEPENDENCIES_INSTALLED : "dependencies-installed"
};
/*================================================================================
END OF TASK LIST
================================================================================*/

const SKIP_INTRO = false;

//#region //*____________________ INTRO ____________________
const Intro = async() => {
	if (SKIP_INTRO) {
		emitter.emit(TASKS.INTRO_COMPLETE);
		return;
	}

	const raidenIntro = {
		text: [
			"     ____   ___    _____  ____   ______ _   __",
			"    / __ | /   |  /_  _/ / __ | / ____// | / /",
			"   / /_/ // /| |   / /  / / / // __/  /  |/ / ",
			"  / _, _// ___ | _/ /_ / /_/ // /___ / /|  /  ",
			" /_/ |_|/_/  |_|/____//_____//_____//_/ |_/   ",
		],
		get lineCount() {
			return this.text.length;
		},
		get charCount() {
			return this.text[0].length;
		},
		get firstCharPositions() {
			return this.text.map(ln => {
				for (let i = 0; i < ln.length; i++) {
					if (ln[i] !== " " && ln[i] !== ".") return i;
				}
			});
		}
	};

	//* This loop handles the effect going left to right
	for (let effectIdx = 0; effectIdx < raidenIntro.charCount; effectIdx++) {
		// * Loop over the lines one by one
		for (let lineIdx = 0; lineIdx < raidenIntro.lineCount; lineIdx++) {
			const line = raidenIntro.text[lineIdx];
			const pos = raidenIntro.firstCharPositions[lineIdx] + effectIdx;
			process.stdout.write(line.substring(0, pos).grey);
			process.stdout.write(line.substring(pos, pos + 1).cyan);
			process.stdout.write(line.substring(pos + 1).grey);
			MoveCursorToNewLine();
		}

		// * Only reset cursor if not finished
		//if (effectIdx < raidenIntro.charCount - 1) {
		process.stdout.moveCursor(-1000, -raidenIntro.lineCount);
		//}
		await Sleep(20);
	}

	raidenIntro.text.map(line => {
		process.stdout.write(line.cyan);
		MoveCursorToNewLine();
	});

	//* This loop handles the typewriter caption
	process.stdout.moveCursor(-1000, 1); // down by 1
	process.stdout.write(` V${ raidenVersion }`.cyan);
	MoveCursorToNewLine();
	
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const caption = " by Pete Savva @ techandtribal.com";

	for (let idx = 0; idx < caption.length; idx++) {
		for (let effectCount = 0; effectCount < RandomBetween(3,15); effectCount++) {
			const str = caption.substring(0, idx) + alphabet[RandomBetween(0, 25)];
			process.stdout.moveCursor(-1000, 0);
			process.stdout.write(str.cyan);
			await Sleep(RandomBetween(10));
		}

		await Sleep(5);
	}

	process.stdout.moveCursor(-1000, 0);
	process.stdout.write(caption.cyan);
	process.stdout.moveCursor(-1000, 2);

	emitter.emit(TASKS.INTRO_COMPLETE);
};
Intro();

//#endregion
/*================================================================================
END OF INTRO
================================================================================*/

//*____________________ BEGIN PROGRAM ____________________
let projectName = process.argv[2]; //* ARGS PASSED IN FROM COMMAND LINE

emitter.on(TASKS.INTRO_COMPLETE, () => {
	// TODO ensure passed in lowercase and with no numbers or next js will reject ?
	if (projectName !== null && projectName !== undefined) {
		process.stdout.write("Name is ok".cyan);
		emitter.emit(TASKS.CHECKS_COMPLETE);
	} else {
		process.stdout.write("Name is not ok".red);

		const rl = readline.createInterface({
			input  : process.stdin,
			output : process.stdout
		});

		rl.question("What is the name of your app?  ", (inp) => {
			if (typeof inp === "string") {
				projectName = inp;
				rl.close();
			} else {
				process.stdout.write("Strings only".red);
				process.exit();
			}
		});

		rl.on("close", () => {
			emitter.emit(TASKS.CHECKS_COMPLETE);
		});
	}
});

//* INIT
emitter.on(TASKS.CHECKS_COMPLETE, () => {
	process.stdout.write(`\nCreating project '${ projectName }'`.magenta);

	Run("node -v", false).then(nodeVersion => {
		Run("npm -v", false).then(npmVersion => {
			process.stdout.write(`\n\nNode: '${ nodeVersion }'. NPM: '${ npmVersion }'`.cyan);
			
			// * CREATE DIRECTORIES
			process.stdout.write("\n\nCreating directories".magenta);
			Run(`mkdir ${ projectName }`, false).then(() => {
				Run("mkdir public", projectName).then(() => {
					Run("mkdir public/fonts", projectName);
				});
				Run("mkdir src", projectName).then(() => {
					Run("mkdir src/pages", projectName);
				});
				Run("mkdir styles", projectName);
				Run("npm init -f", projectName).then(() => {
					emitter.emit(TASKS.INIT_COMPLETE);
				});
			});
		});
	});
});

//* AMEND PACKAGE JSON
emitter.on(TASKS.INIT_COMPLETE, () => {
	process.stdout.write("\nUpdating package.json".magenta);

	// * GRAB THE NEWLY CREATED PACKAGE.JSON FILE
	const packageJsonFile = `${ process.cwd() }/${ projectName }/package.json`;
	let data = require(packageJsonFile);

	// TODO does stringify fuck up the true?
	// TODO switch to package read method instead?
	data = {
		...data,
		author      : "Pete Savva <p.savva@protonmail.ch> (https://techandtribal.com)",
		description : "NextJS app built by Raiden",
		license     : "ISC",
		private     : true,
		homepage    : `https://github.com/baufometic/${ projectName }#readme`,
		repository  : {
			"type" : "git",
			"url"  : `https://github.com/baufometic/${ projectName }.git`,
		},
		bugs: {
			"url": `https://github.com/baufometic/${ projectName }/issues`,
		},
		scripts: {
			"cleanup"     : "rm -rf .next",
			"dev:cleanup" : "npm run cleanup && next dev",
			"dev"         : "next dev",
			"build"       : "next build",
			"start"       : "next start",
			"lint"        : "next lint",
			"test"        : "jest",
			"test:watch"  : "jest --watch"
		}
	};

	delete data.main;
	delete data.keywords;
	const dataStringified = JSON.stringify(data, null, 4);
	fs.writeFile(packageJsonFile, dataStringified, err => err || true);
	process.stdout.write("\nDone".cyan);
	emitter.emit(TASKS.PACKAGE_JSON_UPDATED);
});

//* COPY FILES - this will cover all except those which cover
emitter.on(TASKS.PACKAGE_JSON_UPDATED, () => {
	const filesToCopy = [
		{ name: ".eslintrc.json", hasCopied: false },
		{ name: "next-env.d.ts", hasCopied: false },
		{ name: "next.config.js", hasCopied: false },
		{ name: "README.md", hasCopied: false },
		{ name: "tsconfig.json", hasCopied: false },
		{ name: "public/favicon.ico", hasCopied: false },
		{ name: "public/raiden.jpg", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.eot", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.svg", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.ttf", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.woff", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.woff2", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.eot", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.svg", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.ttf", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.woff", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.woff2", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.eot", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.svg", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.ttf", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.woff", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.woff2", hasCopied: false },
		{ name: "src/pages/_app.tsx", hasCopied: false },
		{ name: "src/pages/_document.tsx", hasCopied: false },
		{ name: "src/pages/index.tsx", hasCopied: false },
		{ name: "styles/globals.css", hasCopied: false },
	];

	const pathToSourceFiles = path.join(__dirname, "../filesToCopy/");
	process.stdout.write(`\n\nCopying files from ${ pathToSourceFiles }`.magenta);
	
	for (let idx = 0; idx < filesToCopy.length; idx++) {
		const sourceFile = pathToSourceFiles + filesToCopy[idx].name;
		const destinationFile = path.join(projectName, filesToCopy[idx].name);
	
		fs.copyFile(sourceFile, destinationFile, (err) => {
			if (err) {
				process.stdout.write("Error copying file".red);
				throw err;
			} else {
				filesToCopy[idx].hasCopied = true;
				const noOfCopiedFiles = filesToCopy.filter(file => file.hasCopied).length;
				process.stdout.write(`\nCopied [${ noOfCopiedFiles }/${ filesToCopy.length }] ${ filesToCopy[idx].name }`.cyan);
				
				if (noOfCopiedFiles === filesToCopy.length) {
					FlashingText("File copying complete").then(() => {
						emitter.emit(TASKS.FILES_COPIED);
					});
				}
			}
		});
	}
});

//* INITIALISE GIT IN REPO
emitter.on(TASKS.FILES_COPIED, () => {
	process.stdout.write("\n\nInitialising Git".magenta);

	Run("git init", projectName).then(() => {
		FlashingText("Git initialised").then(() => {
			emitter.emit(TASKS.GIT_INITIALISED);
		});
	});
});

//* INSTALL DEPENDENCIES
emitter.on(TASKS.GIT_INITIALISED, () => {
	const dependencies = [
		"@fortawesome/fontawesome-svg-core",
		"@fortawesome/free-brands-svg-icons",
		"@fortawesome/free-regular-svg-icons",
		"@fortawesome/free-solid-svg-icons",
		"@fortawesome/react-fontawesome",
		"@supabase/supabase-js",
		"@techandtribal/combronents",
		"@techandtribal/maximilian",
		"next",
		"nodemailer",
		"react",
		"react-dom",
		"styled-components",
	];

	const devDependencies = [
		"@testing-library/jest-dom",
		"@testing-library/react",
		"@testing-library/user-event",
		"@types/jest",
		"@types/node",
		"@types/nodemailer",
		"@types/react",
		"@types/react-dom",
		"@types/styled-components",
		"@typescript-eslint/eslint-plugin",
		"eslint",
		"eslint-config-next",
		"jest",
		"typescript",
	];

	process.stdout.write("\n\nInstalling dependencies".magenta);
	Run(`npm i ${ dependencies.map(d => d).join(" ") }`, projectName).then(() => {
		MoveCursorToNewLine();
		FlashingText("Dependencies installed").then(() => {
			process.stdout.write("\n\nInstalling dev dependencies".magenta);
			Run(`npm i -D ${ devDependencies.map(d => d).join(" ") }`, projectName).then(() => {
				MoveCursorToNewLine();
				FlashingText("Dev dependencies installed").then(() => {
					emitter.emit(TASKS.DEPENDENCIES_INSTALLED);
				});
			});
		});
	});
});

//* EXECUTE 'NPM RUN DEV'
emitter.on(TASKS.DEPENDENCIES_INSTALLED, () => {
	process.stdout.write(`\n\nProject ${ projectName } created`.cyan);
	process.stdout.write("\nStarting server on port 3000".cyan);
	Run("npm run dev", projectName);
});
