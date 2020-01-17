
import * as path from "path";
import { BrowserWindow, app } from "electron";

app.commandLine.appendSwitch("lang", "ja");
let aw: BrowserWindow = null;
app.on("ready", () =>
{
    aw = new BrowserWindow({
        title: "Question Master Editor",
        webPreferences: {
            experimentalFeatures: true
        }
    });
    
    aw.loadFile(path.resolve(__dirname, "index.html"));
});
app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin") app.quit();
});
