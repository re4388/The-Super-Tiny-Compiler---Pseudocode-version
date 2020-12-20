/**
 * So now we have our AST, and we want to be able to visit different nodes with
 * a visitor. We need to be able to call the methods on the visitor whenever we
 * encounter a node with a matching type.
 *
 *   traverse(ast, {
 *     Program: {
 *       enter(node, parent) {
 *         ...
 *       },
 *       exit(node, parent) {
 *         ...
 *       },
 *     },
 *
 *     CallExpression: {
 *       enter(node, parent) {
 *          ...
 *       },
 *       exit(node, parent) {
 *          ...
 *       },
 *     },
 *
 *     NumberLiteral: {
 *       enter(node, parent) {
 *         ...
 *       },
 *       exit(node, parent) {
 *         ...
 *       },
 *     },
 *   });
 */
/* A traverser function which accepts an AST and a visitor */
export function traverser(ast: OldAst, visitor: Visitor) {
  checkVisitMethodAndEnter(visitor);
  traverseByNodeTypeRecursively(ast, null, visitor); // null is ude to ast node have no `parent`
  checkVisitMethodAndExit(visitor);
}

function traverseByNodeTypeRecursively(elementNode, parent) {
  switch (elementNode.type) {
    case 'Program':
      traverseProgramBodyNode();
    case 'CallExpression':
      traverseParamsNode();
    case 'NumberLiteral':
    case 'StringLiteral':
      noNeedToVisit();

    default:
      throw new TypeError(elementNode.type);
  }
}

// A `traverseArray` function that will allow us to iterate over an array and
// call the next function that we will define: `traverseNode`.
function traverseNodeArray(nodeArray, parent) {
  nodeArray.forEach((ele) => {
    traverseByNodeTypeRecursively(ele, parent);
  });
}

function checkVisitMethodAndExit(visitor) {
  if (methods && methods.exit) {
    methods.exit(elementNode, parent);
  }
}

function checkVisitMethodAndEnter(visitor) {
  // testing for the existence of a method on the visitor with a matching `type`.
  let methods = visitor[eleNode.type];
  // If there is an `enter` method for this node type we'll call it with the
  // `node` and its `parent`.
  if (methods && methods.enter) {
    methods.enter(eleNode, parent);
  }
}

function traverseProgramBodyNode() {
  traverseNodeArray(elementNode.body, elementNode);
  break;
}

function traverseParamsNode() {
  traverseNodeArray(elementNode.params, elementNode);
  break;
}

function noNeedToVisit() {
  break;
}
