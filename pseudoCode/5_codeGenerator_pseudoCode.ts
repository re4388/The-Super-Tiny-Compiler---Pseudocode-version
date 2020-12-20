/**
 * ============================================================================
 *                               ヾ（〃＾∇＾）ﾉ♪
 *                            THE CODE GENERATOR!!!!
 * ============================================================================
 */

/**
 * Now let's move onto our last phase: The Code Generator.
 *
 * Our code generator is going to recursively call itself to print each node in
 * the tree into one giant string.
 */
export function codeGenerator(node: CAst): string {
  createStringByNodeTypeRecursively(node);
}

function createStringByNodeTypeRecursively(node) {
  switch (node.type) {
    case 'Program':
      return addNewLine(node);

    case 'ExpressionStatement':
      return addSemiColon(node);

    case 'CallExpression':
      return addParenthesisToCalleeAndArgument(node);

    case 'Identifier':
      return nodeName(node);

    case 'NumberLiteral':
      return nodeValue(node);

    case 'StringLiteral':
      return nodeValueWithQuotations(node);

    default:
      throw new TypeError(node.type);
  }
}

function addNewLine(node) {
  // If we have a `Program` node. We will map through each node in the `body`
  // and run them through the code generator and join them with a newline.
  return node.body.map(codeGenerator).join('\n');
}

function addSemiColon(node) {
  // For `ExpressionStatement` we'll call the code generator on the nested
  // expression and we'll add a semicolon...
  return codeGenerator(node.expression) + ';';
}

function addParenthesisToCalleeAndArgument(node) {
  // For `CallExpression` we will print the `callee`, add an open
  // parenthesis, we'll map through each node in the `arguments` array and run
  // them through the code generator, joining them with a comma, and then
  // we'll add a closing parenthesis.
  return (
    codeGenerator(node.callee) +
    '(' +
    node.arguments.map(codeGenerator).join(', ') +
    ')'
  );
}

function nodeName(node) {
  // For `Identifier` we'll just return the `node`'s name.
  return node.name;
}

function nodeValue(node) {
  // For `NumberLiteral` we'll just return the `node`'s value.
  return node.value;
}

function nodeValueWithQuotations(node) {
  // For `StringLiteral` we'll add quotations around the `node`'s value.
  return '"' + node.value + '"';
}
