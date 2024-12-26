"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = runCommand;
exports.executeCommand = executeCommand;
exports.openTerminal = openTerminal;
const child_process_1 = require("child_process");
/**
 * Exécute une commande de manière synchrone.
 * @param command - La commande à exécuter.
 * @param options - Options supplémentaires pour l'exécution.
 */
function runCommand(command, options = {}) {
    try {
        console.log(`Exécution : ${command}`);
        (0, child_process_1.execSync)(command, Object.assign({ stdio: "inherit" }, options));
    }
    catch (error) {
        console.error(`Erreur lors de l'exécution : ${error.message}`);
        process.exit(1);
    }
}
/**
 * Exécute une commande de manière asynchrone.
 * @param command - La commande à exécuter.
 * @param callback - Fonction de rappel avec le résultat ou une erreur.
 */
function executeCommand(command, callback) {
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
        if (error) {
            callback(`Erreur: ${stderr}`);
        }
        else {
            callback(stdout);
        }
    });
}
/**
 * Ouvre un terminal et exécute une commande en fonction du système d'exploitation.
 * @param command - La commande à exécuter dans le terminal.
 */
function openTerminal(command) {
    const platform = process.platform;
    if (platform === "win32") {
        // Windows (CMD)
        (0, child_process_1.spawn)("cmd.exe", ["/c", `start cmd.exe /k \"${command}\"`], { shell: true });
    }
    else if (platform === "darwin") {
        // macOS (Terminal)
        (0, child_process_1.spawn)("osascript", [
            "-e",
            `tell application \"Terminal\" to do script \"${command}\"`
        ]);
    }
    else if (platform === "linux") {
        // Linux (GNOME Terminal)
        (0, child_process_1.spawn)("gnome-terminal", ["--", "bash", "-c", command]);
    }
    else {
        console.error("Système d'exploitation non supporté");
    }
}
