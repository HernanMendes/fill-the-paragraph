const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	console.log('Congratulations, your extension "fill-the-paragraph" is now active!');

	let disposable = vscode.commands.registerCommand('fill-the-paragraph.fill', function () {
		// Get the active text editor
		let editor = vscode.window.activeTextEditor;
		let maxLineLength = vscode.workspace.getConfiguration('fill-the-paragraph').get('maxLineLength');

		if (editor) {
			let document = editor.document;
			let line = vscode.window.activeTextEditor.selection.active.line;

			// Get the word within the selection
			let line_text = document.lineAt(line).text;

			if(line_text.length > maxLineLength) {
				vscode.window.showInformationMessage(`WARNING: Line is too long!`);
				// Split the line
				let chunks = line_text.match(new RegExp(`.{1,${maxLineLength-4}}`, 'g'));

				vscode.window.activeTextEditor.edit((editBuilder) => {
					// Replace first line with first chunk
					editBuilder.replace(new vscode.Range(line, 0, line, line_text.length), chunks[0]+'"\\');
					for (let i = 1; i < chunks.length-1; i++) {
						editBuilder.insert(new vscode.Position(i, 4), 'f"'+chunks[i]+'"\\');
					}
					// Replace last line with last chunk
					editBuilder.insert(new vscode.Position(chunks.length-1, 4), 'f"'+chunks[chunks.length-1]);
				});
			}
		}
	});
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
