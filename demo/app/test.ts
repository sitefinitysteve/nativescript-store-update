import { runTestApp } from "@nativescript/unit-test-runner";
// import other polyfills here

declare let require: any;

runTestApp({
	runTests: () => {
		const tests = require.context("./", true, /\.spec\.js$/);
		console.log("tests", tests.keys());
		tests.keys().map(tests);
	},
});
