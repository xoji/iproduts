import * as fs from "fs";
import * as path from "path";

const filepath = path.resolve(__dirname, '..', 'logs', 'error.log');
export function debug(params: {message: string; file: string; method: string}) {
    fs.appendFile(filepath, `${params.file} -- ${params.method} -- ${params.message}, ${new Date()};\n`, (err) => {
        if (err) {
            console.log(err);
        }
    });
}