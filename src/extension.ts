// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "MoCommander" is now active!');
	const filePath = vscode.workspace.rootPath + '/.commands_mo.txt';

	context.subscriptions.push(vscode.commands.registerCommand('MoCommander.addcmd', () => {
		const options: vscode.InputBoxOptions = {
			prompt: "Enter the file name pattern to search for",
			placeHolder: "*.ts"
		};

		vscode.window.showInputBox(options).then(cmd => {
			if (!cmd) {
				vscode.window.showErrorMessage("No pattern provided");
				return;
			}
			fs.appendFile(filePath, cmd + '\n', (err: any) => {
				if (err) {
					vscode.window.showErrorMessage("Failed to save the command");
				} else {
					vscode.window.showInformationMessage(`Command "${cmd}" in ${filePath} saved successfully`);
				}
			});
		});
	}));
	//execute the command
	context.subscriptions.push(vscode.commands.registerCommand('MoCommander.executecmd', () => {
		// vscode.window.showInformationMessage('Hello World from MoCommander!');
		fs.readFile(filePath, 'utf8', (err: any, data: string) => {
			if (err) {
				vscode.window.showErrorMessage("Failed to read the commands file");
				return;
			}
			const commands = data.split('\n').filter(cmd => cmd.trim() !== '');
			vscode.window.showQuickPick(commands, { placeHolder: 'Select a command to execute' }).then(selectedCmd => {
				if (!selectedCmd) {
					vscode.window.showErrorMessage("No command selected");
					return;
				}
				if (vscode.window.activeTerminal) {
					vscode.window.activeTerminal.sendText(selectedCmd);
					if(vscode.window.activeTerminal){
					vscode.window.activeTerminal.show();
				}
				} else {
					const terminal = vscode.window.createTerminal(`command-terminal`);
					terminal.sendText(selectedCmd);
					terminal.show();
				}
			});
		});

	}));

}

// This method is called when your extension is deactivated
export function deactivate() {}
