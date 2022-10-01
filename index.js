const globCallback = require("glob");
const fs = require("fs").promises;
const { promisify } = require("util");
const glob = promisify(globCallback);

async function convert () {
    const files = await glob(`./registries/client/xotosphere-client-ui/src/**/*.ts`, {ignore: ["**/.d.ts", "__types__", "**/node_modules/**"]});
    const total = files.length;
    let counter = 0;
    for (const file of files) {
        counter++;
        console.log(Math.floor(100 / total * counter));
		await parseFile(file);
    }
    console.log("DONE")
}

async function parseFile (filePath) {
    const fileName = filePath.split("/").at(-1);
    const duplicatedFilesPath = (await glob(`./registries/client/**/${fileName}`, { ignore: ["**/.d.ts", "__types__", "**/node_modules/**"] })).filter(currentFilePath => !/xotosphere-client-ui/.test(currentFilePath))
    for (let duplicatedFilePath of duplicatedFilesPath) {
        await fs.unlink(duplicatedFilePath);
    }
}

convert();
