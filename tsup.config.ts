import { defineConfig } from "tsup";
import { exec } from "child_process";

function build(ignoredFiles: string[], ignoredFolders: string[]) {
	exec("if exist dist rmdir /s /q dist");
	exec("mkdir dist");
	const robocopyCommand = `robocopy . dist /E /XF ${ignoredFiles.join(
		" "
	)} /XD ${ignoredFolders.join(" ")} dist`;
	exec(robocopyCommand);
}

export default defineConfig((options) => {
	return {
		entry: {
			background: "./src/background/index.ts",
			"content-scripts": "./src/content-scripts/index.ts",
			popup: "./src/popup/index.ts",
		},
		outDir: "./js",
		sourcemap: !!options.watch,
		minify: !options.watch,
		clean: true,
		onSuccess: async () => {
			if (!options.watch) {
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
