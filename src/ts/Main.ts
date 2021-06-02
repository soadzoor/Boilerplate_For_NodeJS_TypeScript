import {FileUtils} from "utils/FileUtils";

export class Main
{
	constructor()
	{
		this.init();
	}

	private async init()
	{
		// const inputFile = await FileUtils.readTextFile("test.txt");
		// console.log(inputFile);

		// await FileUtils.appendToFile("output.txt", "haligali");
	}
}

const main = new Main();