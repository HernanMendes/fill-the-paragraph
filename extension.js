const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "fill-the-paragraph" is now active!');

	let disposable = vscode.commands.registerCommand('fill-the-paragraph.fill', function () {
		const maxLineLength = 120;
		// Get the active text editor
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let line = vscode.window.activeTextEditor.selection.active.line
			let position = vscode.window.activeTextEditor.selection.active.character

			// Get the word within the selection
			let line_text = document.lineAt(line).text;

			vscode.window.showInformationMessage(`Line: ${line} - Line Text: ${line_text} - Position: ${position}`);
			if(line_text.length > maxLineLength) {
				vscode.window.showInformationMessage(`WARNING: Line is too long!`);
				// Chunk the line into 5 character chunks
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

	let disposable2 = vscode.commands.registerCommand('fill-the-paragraph.position', function () {
		// Get the active text editor
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let line = vscode.window.activeTextEditor.selection.active.line
			let position = vscode.window.activeTextEditor.selection.active.character

			vscode.window.showInformationMessage(`Line: ${line} - Position: ${position}`);
		}
	});

	context.subscriptions.push(disposable2);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
