export interface Token {
  type: TokenType;
  value: string;
}

type TokenType = 'number' | 'paren' | 'string' | 'name';

export interface OriginAstNode {
  type: Extract<'Program', TraverseNodeType>;
  body: ExpressionNode[];
  _context?: ExpressionStatementNode[];
}

type TraverseNodeType =
  | 'Program'
  | 'NumberLiteral'
  | 'CallExpression'
  | 'StringLiteral'
  | 'OtherLiteral';

export interface ExpressionNode {
  type: NodeType;
  name: string;
  params: LiteralNode[];
  _context?: LiteralNode[];
}

// type NodeType = 'CallExpression';
type NodeType = Extract<'CallExpression', TraverseNodeType>;

export interface LiteralNode {
  type: ParamsType;
  value: string;
  _context?: LiteralNode[];
}

type ParamsType = Extract<
  'NumberLiteral' | 'StringLiteral' | 'OtherLiteral',
  TraverseNodeType
>;

export interface TraverseNode {
  type: TraverseNodeType;
}

export type Visitor = {
  [key in TraverseNodeType]?: EnterAndExistFns;
};

interface EnterAndExistFns {
  enter: Function;
  exit?: Function;
}

export type AllNodeType = OriginAstNode | ExpressionNode | LiteralNode;

export interface NewAstNode {
  type: 'Program';
  body: ExpressionStatementNode[];
}

interface ExpressionStatementNode {
  type: 'ExpressionStatement';
  expression: ExpressionType;
}

interface ExpressionType {
  type: 'CallExpression';
  callee: CalleeType;
  arguments: ArgType[] | ExpressionType[];
}

interface CalleeType {
  type: 'Identifier';
  name: CalleeTypeName;
}

type CalleeTypeName = 'add' | 'subtract';

interface ArgType {
  type: 'NumberLiteral';
  value: string;
}
