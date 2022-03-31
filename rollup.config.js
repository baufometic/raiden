import shebang from "rollup-plugin-preserve-shebang";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

//const packageJson = require("./package.json");
const NODE_ENV = process.env.NODE_ENV || "development";

const plugins = [
	shebang(),
	replace({
		exclude                : "node_modules/**",
		preventAssignment      : true,
		"process.env.NODE_ENV" : JSON.stringify(NODE_ENV),
	}),
	json(),
	peerDepsExternal(),
	nodeResolve(),
	commonjs(),
];

export default [
	{
		input  : "src/index.js",
		output : [
			{
				file   : "bin/build.js",
				format : "esm"
			}
		],
		plugins: [ ...plugins ],
	},
];
