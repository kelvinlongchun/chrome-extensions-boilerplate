import { defineConfig } from "tsup";
import { exec } from "child_process";

function runCommand(command: string) {
	console.log("\x1b[32mRunning command: \x1b[0m" + command);

	exec(command, (error, stdout, stderr) => {
		if (error && error.code !== 1) {
			console.error(
				"\x1b[31mCould not build the extension: \x1b[0m" +
					error +
					` Error Code: ${error.code}`
			);
		}
		if (stdout !== "") {
			console.log("\x1b[32mstdout: \x1b[0m" + stdout);
		}
		if (stderr !== "") {
			console.error("\x1b[31mstderr: \x1b[0m" + stderr);
		}
	});
}

function build(ignoredFiles: string[], ignoredFolders: string[]) {
	const robocopyCommand = `robocopy . dist /E /XF ${ignoredFiles.join(
		" "
	)} /XD ${ignoredFolders.join(" ")} dist`;

	runCommand(robocopyCommand);
}

export default defineConfig((options) => {
	const isWatch = !!options.env && "WATCH" in options.env;

	return {
		entry: {
			background: "./src/background/index.ts",
			"content-scripts": "./src/content-scripts/index.ts",
			popup: "./src/popup/index.ts",
		},
		outDir: "./js",
		sourcemap: isWatch,
		minify: !isWatch,
		clean: true,
		onSuccess: async () => {
			if (!isWatch) {
				const ignoredFiles = [
					"package.json",
					"package-lock.json",
					"tsconfig.json",
					"tsup.config.ts",
					".gitignore",
					"README.md",
				];
				const ignoredFolders = ["node_modules", "src"];
				build(ignoredFiles, ignoredFolders);
			}
		},
	};
});
