import { Visitor } from '../originalCodeAndWIPCode/compilerType';
/**
 * ============================================================================
 *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
 *                              THE TRANSFORMER!!!
 * ============================================================================
 */

/**
 * Next up, the transformer. Our transformer is going to take the AST that we
 * have built and pass it to our traverser function with a visitor and will
 * create a new ast.
 *
 * ----------------------------------------------------------------------------
 *   Original AST                     |   Transformed AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *  (sorry the other one is longer.)  |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */

import { traverser } from '3_traverser_pseudoCode copy copy 3';

// So we have our transformer function which will accept the lisp ast.
export function transformer(oldAst: OldAst, visitor: Visitor): NewAst {
  const newAst = initNewEmptyAst();
  linkNewAstRefToOldAst();
  return traverser(oldAst, visitor);
}

function initNewEmptyAst() {
  return {
    type: 'Program',
    body: [],
  };
}

function linkNewAstRefToOldAst() {
  // cheat a little and create a bit of a hack. We're going to
  // use a property named `context` on our parent nodes that we're going to push
  // nodes to their parent's `context`. Normally you would have a better
  // abstraction than this, but for our purposes this keeps things simple.
  //
  // Just take note that the context is a reference *from* the old ast *to* the
  // new ast.
  ast._context = newAst.body;
}

const visitor = {
  NumberLiteral: {
    enter(node, parent) {
      visitorPushLiteralNode('NumberLiteral', node, parent);
    },
  },

  StringLiteral: {
    enter(node, parent) {
      visitorPushLiteralNode('StringLiteral', node, parent);
    },
  },

  CallExpression: {
    enter(node, parent) {
      let expression = visitorPushCallExpressionNode(
        'CallExpression',
        node,
        parent
      );
      addExpressArgumentRefToCallExpressionNode(expression);
      expression = ifParentIsNotCallExpressThenUseStatement(expression);
      parent._context.push(expression);
    },
  },
};

function visitorPushLiteralNode(literalType: string, node, parent) {
  parent._context.push({
    type: 'NumberLiteral',
    value: node.value,
  });
}

function visitorPushCallExpressionNode(type: string, node, parent) {
  return {
    type: type,
    callee: {
      type: 'Identifier',
      name: node.name,
    },
    arguments: [],
  };
}

function ifParentIsNotCallExpressThenUseStatement(expression) {
  // Then we're going to check if the parent node is a `CallExpression`.
  // If it is not...
  if (parent.type !== 'CallExpression') {
    // We're going to wrap our `CallExpression` node with an
    // `ExpressionStatement`. We do this because the top level
    // `CallExpression` in JavaScript are actually statements.
    expression = {
      type: 'ExpressionStatement',
      expression: expression,
    };
  }
}

function addExpressArgumentRefToCallExpressionNode(expression) {
  // Next we're going to define a new context on the original
  // `CallExpression` node that will reference the `expression`'s arguments
  // so that we can push arguments.
  node._context = expression.arguments;
}
