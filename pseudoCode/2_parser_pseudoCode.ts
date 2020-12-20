/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE PARSER!!!
 * ============================================================================
 */

import { OriginAstNode, Token } from '../originalCodeAndWIPCode/compilerType';

/**
 * For our parser we're going to take our array of tokens and turn it into an
 * AST.
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */
export function parser(tokens: Token[]): OriginAstNode {
  let currentIndex = 0;
  initProgramNode();
  traverseTokensArrayAndCreateNodeRecursively(); //this function is key and how to name it is particular important
  return ast;
}

function initProgramNode() {
  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  let ast = {
    type: 'Program',
    body: [],
  };
}

function traverseTokensArrayAndCreateNodeRecursively() {
  while (currentIndex < tokens.length) {
    ast.body.push(createNodesRecursively());
  }
}

/* This time we're going to use recursion instead of a `while` loop. So we define a `walk` function. */
function createNodesRecursively() {
  // Inside the walk function we start by grabbing the `current` token.
  let token = tokens[currentIndex];
  createNumberLiteralNode();
  createStringLiteralNode();
  createCallExpressionsNodeAndCheckResursive();
  throw new TypeError(token.type);
}

function createNumberLiteralNode() {
  // We're going to split each type of token off into a different code path,
  // starting off with `number` tokens.

  //
  // We test to see if we have a `number` token.

  if (token.type === 'number') {
    // If we have one, we'll increment `current`.
    currentIndex++;

    // And we'll return a new AST node called `NumberLiteral` and setting its
    // value to the value of our token.
    return {
      type: 'NumberLiteral',
      value: token.value,
    };
  }
}

function createStringLiteralNode() {
  // If we have a string we will do the same as number and create a
  // `StringLiteral` node.
  if (token.type === 'string') {
    currentIndex++;

    return {
      type: 'StringLiteral',
      value: token.value,
    };
  }
}

function createCallExpressionsNodeAndCheckResursive() {
  // Next we're going to look for CallExpressions. We start this off when we
  // encounter an open parenthesis.
  if (seeOpenParen()) {
    // We'll increment `current` to skip the parenthesis since we don't care
    // about it in our AST.
    incrementToken();

    // We create a base node with the type `CallExpression`, and we're going
    // to set the name as the current token's value since the next token after
    // the open parenthesis is the name of the function.
    let node = {
      type: 'CallExpression',
      name: token.value,
      params: [],
    };

    // We increment `current` *again* to skip the name token.
    incrementToken();

    // And now we want to loop through each token that will be the `params` of
    // our `CallExpression` until we encounter a closing parenthesis.
    //
    // Now this is where recursion comes in. Instead of trying to parse a
    // potentially infinitely nested set of nodes we're going to rely on
    // recursion to resolve things.
    //
    // To explain this, let's take our Lisp code. You can see that the
    // parameters of the `add` are a number and a nested `CallExpression` that
    // includes its own numbers.
    //
    //   (add 2 (subtract 4 2))
    //
    // You'll also notice that in our tokens array we have multiple closing
    // parenthesis.
    //
    //   [
    //     { type: 'paren',  value: '('        },
    //     { type: 'name',   value: 'add'      },
    //     { type: 'number', value: '2'        },
    //     { type: 'paren',  value: '('        },
    //     { type: 'name',   value: 'subtract' },
    //     { type: 'number', value: '4'        },
    //     { type: 'number', value: '2'        },
    //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
    //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
    //   ]
    //
    // We're going to rely on the nested `walk` function to increment our
    // `current` variable past any nested `CallExpression`.

    // So we create a `while` loop that will continue until it encounters a
    // token with a `type` of `'paren'` and a `value` of a closing
    // parenthesis.
    while (haveNotSeeCloseParen()) {
      // we'll call the `walk` function which will return a `node` and we'll
      // push it into our `node.params`.
      node.params.push(createNodesRecursively());
      token = tokens[currentIndex];
    }

    // Finally we will increment `current` one last time to skip the closing
    // parenthesis.
    currentIndex++;

    // And return the node.
    return node;
  }
}

function haveNotSeeCloseParen() {
  return (
    token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')
  );
}

function seeOpenParen() {
  return token.type === 'paren' && token.value === '(';
}
function incrementToken() {
  token = tokens[++currentIndex];
}
