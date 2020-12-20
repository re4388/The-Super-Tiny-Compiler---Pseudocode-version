/**
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */

function compiler(lispLangInput) {
  let tokens = tokenizer(lispLangInput);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let cLangOutput = codeGenerator(newAst);

  // and simply return the output!
  return cLangOutput;
}
