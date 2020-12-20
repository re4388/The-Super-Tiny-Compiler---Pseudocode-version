import { tokenizer } from '1_tokenizer_pseudoCode';
import { parser } from '2_parser_pseudoCode';
import { transformer } from '4_transformer_pseudoCode copy 2';
import { codeGenerator } from '5_codeGenerator_pseudoCode copy 3';

export function compiler(lispLangInput) {
  let tokens = tokenizer(lispLangInput);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let cLangOutput = codeGenerator(newAst);

  // and simply return the output!
  return cLangOutput;
}
