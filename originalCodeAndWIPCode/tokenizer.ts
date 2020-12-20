import { Token } from './compilerType';

// We check to see if we have an open parenthesis:
function checkForOpenParenthesis(char: string, tokens: Token[]) {
  if (char === '(') {
    // If we do, we push a new token with the type `paren` and set the value
    // to an open parenthesis.
    tokens.push({
      type: 'paren',
      value: '(',
    });
    // Then we increment `current`
    currentIndex++;
    // And we `continue` onto the next cycle of the loop.
    continue;
  }
}

export function tokenizer_v2(lispInput: string): Token[] {
  let currentIndex: number = 0;
  let result: Token[] = [];
  while (currentIndex < lispInput.length) {
    let char: string = lispInput[currentIndex];

    // We check to see if we have an open parenthesis:
    if (char === '(') {
      // If we do, we push a new token with the type `paren` and set the value
      // to an open parenthesis.
      result.push({
        type: 'paren',
        value: '(',
      });

      // Then we increment `current`
      currentIndex++;
      // And we `continue` onto the next cycle of the loop.
      continue;
    }

    // Next we're going to check for a closing parenthesis. We do the same exact
    // thing as before: Check for a closing parenthesis, add a new token,
    // increment `current`, and `continue`.
    // TODO: same pattern to push data
    if (char === ')') {
      result.push({
        type: 'paren',
        value: ')',
      });
      currentIndex++;
      continue;
    }

    // Moving on, we're now going to check for whitespace. This is interesting
    // because we care that whitespace exists to separate characters, but it
    // isn't actually important for us to store as a token. We would only throw
    // it out later.
    //
    // So here we're just going to test for existence and if it does exist we're
    // going to just `continue` on.
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      currentIndex++;
      continue;
    }

    // The next type of token is a number. This is different than what we have
    // seen before because a number could be any number of characters and we
    // want to capture the entire sequence of characters as one token.
    //
    //   (add 123 456)
    //        ^^^ ^^^
    //        Only two separate tokens
    //
    // So we start this off when we encounter the first number in a sequence.
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      // We're going to create a `value` string that we are going to push
      // characters to.
      let value = '';

      // Then we're going to loop through each character in the sequence until
      // we encounter a character that is not a number, pushing each character
      // that is a number to our `value` and incrementing `current` as we go.
      while (NUMBERS.test(char)) {
        value += char;
        char = lispInput[++currentIndex];
      }

      // After that we push our `number` token to the `tokens` array.
      result.push({ type: 'number', value });

      // And we continue on.
      continue;
    }

    // We'll also add support for strings in our language which will be any
    // text surrounded by double quotes (").
    //
    //   (concat "foo" "bar")
    //            ^^^   ^^^ string tokens
    //
    // We'll start by checking for the opening quote:
    if (char === '"') {
      // Keep a `value` variable for building up our string token.
      let value = '';

      // We'll skip the opening double quote in our token.
      char = lispInput[++currentIndex];

      // Then we'll iterate through each character until we reach another
      // double quote.
      while (char !== '"') {
        value += char;
        char = lispInput[++currentIndex];
      }

      // Skip the closing double quote.
      char = lispInput[++currentIndex];

      // And add our `string` token to the `tokens` array.
      result.push({ type: 'string', value });

      continue;
    }

    // The last type of token will be a `name` token. This is a sequence of
    // letters instead of numbers, that are the names of functions in our lisp
    // syntax.
    //
    //   (add 2 4)
    //    ^^^
    //    Name token
    //
    // TODO: second time we see this regex pattern
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      // Again we're just going to loop through all the letters pushing them to
      // a value.
      while (LETTERS.test(char)) {
        value += char;
        char = lispInput[++currentIndex];
      }

      // And pushing that value as a token with the type `name` and continuing.
      result.push({ type: 'name', value });

      continue;
    }

    // Finally if we have not matched a character by now, we're going to throw
    // an error and completely exit.
    throw new TypeError('I do not know what this character is: ' + char);
  }

  // Then at the end of our `tokenizer` we simply return the tokens array.
  return result;
}
