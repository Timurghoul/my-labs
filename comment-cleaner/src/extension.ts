import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
  console.log('CommentCleaner запущен');
  const disposable = vscode.commands.registerCommand('commentCleaner.cleanSelection', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const document = editor.document;
    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showInformationMessage('Выдели код для очистки.');
      return;
    }
    let text = document.getText(selection);
    const originalText = text;
    const commentRegex = /\/\/[^\n]*|\/\*[\s\S]*?\*\//gm;
    text = text.replace(commentRegex, match => {
      const clean = match.replace(/^\/[/*]\s*/, ''); 
      const firstChar = clean.trim().charAt(0);
      if (firstChar && firstChar === firstChar.toLowerCase()) {
        return ''; 
      }
      return match;
    });

    if (text === originalText) {
      vscode.window.showInformationMessage('Комментариев для удаления не найдено.');
      return;
    }
    await editor.edit(editBuilder => editBuilder.replace(selection, text));
    vscode.window.showInformationMessage('🧹 Удалены комментарии, начинающиеся с маленькой буквы.');
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}
