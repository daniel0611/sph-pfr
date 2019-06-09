import fs from "fs";
import util from "util";
const readFile = util.promisify(fs.readFile);

export class Settings {
    url: string;
    password: string;
    forwardId: number;

    static async read(file: string): Promise<Settings> {
        const jsonString = await readFile(file);
        const inst: Settings = JSON.parse(jsonString.toString());

        inst.url = process.env["SPH_URL"] || inst.url;
        inst.password = process.env["SPH_PW"] || inst.password;
        inst.forwardId = Number.parseInt(process.env["SPH_FW_ID"]) || inst.forwardId;

        return inst;
    }
}
