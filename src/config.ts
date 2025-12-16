import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string,
    currentUserName?: string
}

export function setUser(current_user_name: string){
    const currentConfig = readConfig();
    currentConfig.currentUserName = current_user_name;
    writeConfig(currentConfig);
}

export function readConfig(){
    const filePath = getConfigFilePath();
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const configJSON = JSON.parse(fileData);
    const configObject = validateConfig(configJSON);

    return configObject;
}

function getConfigFilePath(){
    const homeDirectory = os.homedir();
    const fullPath = path.join(homeDirectory, ".gatorconfig.json");

    return fullPath;
}

function writeConfig(currentConfig: Config){
    const filePath = getConfigFilePath();
    const jsonObject: any = {
        "db_url": currentConfig.dbUrl
    }
    if (currentConfig.currentUserName !== undefined){
        jsonObject.current_user_name = currentConfig.currentUserName;
    }
    const jsonString = JSON.stringify(jsonObject);
    fs.writeFileSync(filePath, jsonString);
}

function validateConfig(inputData: any){
    if (!("db_url" in inputData)) {
        throw new Error("Config does not contain db_url...");
    }

    return {
        dbUrl: inputData.db_url,
        currentUserName: inputData.current_user_name
    }
}