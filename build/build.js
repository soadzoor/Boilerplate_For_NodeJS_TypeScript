import fs from "fs";
import esbuild from "esbuild";
import child_process from "child_process";

const {build} = esbuild;

const BUILD_DEV = "build/dev";
const BUILD_PROD = "build/prod";
const BUILD_TEMP = "build/temp";
const NODE_MODULES_PATH = "./node_modules";

const args = process.argv.slice(2);
if (args.includes("--prod"))
{
	process.env.NODE_ENV = "production";
}
const isProduction = process.env.NODE_ENV === "production";
const buildFolder = isProduction ? BUILD_PROD : BUILD_DEV;
const checkForTypeErrors = !args.includes("--fast");

buildApp();

async function buildApp()
{
	console.time("Build time");

	if (checkForTypeErrors)
	{
		console.log("\x1b[33m%s\x1b[0m", "Looking for type errors...");

		try
		{
			if (isProduction)
			{
				exec("tsc", "--noEmit");
			}
			else
			{
				exec("tsc", `--noEmit --incremental --composite false --tsBuildInfoFile ${BUILD_TEMP}/tsconfig.tsbuildinfo`);
			}
		}
		catch (e)
		{
			// typescript error
			process.exit(1);
		}
	}

	console.log("\x1b[33m%s\x1b[0m", "Copying static files...");

	shx(`rm -rf ${buildFolder}`);
	shx(`mkdir ${buildFolder}/`);

	const promises = [
		buildJs(buildFolder)
	];

	await Promise.all(promises);

	//await replaceTextInFile(bundleFilePath(buildFolder), "new Buffer", "Buffer.from");

	console.log("\x1b[32m%s\x1b[0m", "Build done!");
	console.timeEnd("Build time");
}

function shx(command)
{
	const module = "shx";
	const args = command;

	return exec_module(module, args);
}

function exec_module(module, args)
{
	return exec(`"${NODE_MODULES_PATH}/.bin/${module}"`, args);
}

function exec(command, args)
{
	//console.log("command", command, args);

	args = args || "";

	// http://stackoverflow.com/questions/30134236/use-child-process-execsync-but-keep-output-in-console
	// https://nodejs.org/api/child_process.html#child_process_child_stdio

	const stdio = [
		0,
		1, // !
		2
	];

	let result;
	try
	{
		result = child_process.execSync(command + " " + args, {stdio: stdio});
	}
	catch (e)
	{
		// this is needed for messages to display when from the typescript watcher
		throw e;
	}

	return result;
}

function readTextFile(filePath)
{
	return new Promise((resolve, reject) =>
	{
		fs.readFile(filePath, function (err, data)
		{
			if (err)
			{
				reject(err);
			}
			else
			{
				resolve(data.toString());
			}
		});
	});
}

function writeTextFile(filePath, data)
{
	return new Promise((resolve, reject) =>
	{
		fs.writeFile(filePath, data, function (err)
		{
			if (err)
			{
				reject(err);
			}
			else
			{
				resolve(data);
			}
		});
	});
}

async function replaceTextInFile(filePath, oldText, newText)
{
	const regExp = new RegExp(oldText, "g");
	const fileContent = await readTextFile(filePath);
	await writeTextFile(filePath, fileContent.replace(regExp, newText));
}

function bundleFilePath(buildFolder)
{
	return `${buildFolder}/js/app.bundle.js`;
}

function buildJs(buildFolder)
{
	const jsFile = bundleFilePath(buildFolder);

	const options = {
		entryPoints: ["./src/ts/Main.ts"],
		target: "es2017",
		minify: isProduction,
		sourcemap: !isProduction,
		bundle: true,
		platform: "node",
		//splitting: true, // for dynamic import (await import)
		//outdir: buildFolder,
		outfile: jsFile,
		format: "esm"
	};

	console.log("\x1b[33m%s\x1b[0m", "Bundling js...");

	return build(options);
}