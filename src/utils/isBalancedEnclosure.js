export function IsBalancedEnclosure(string) {
  if (string.length === 0) {
    return true;
  }
  let stack = [];
  let closePairs = {
    ")": "(",
    "]": "[",
    "}": "{",
  };
  const openingBrackets = "([{";

  for (const char of string) {
    if (openingBrackets.includes(char)) {
      stack.push(char);
    }
    if (char in closePairs) {
      const matchingBracket = stack.pop();
      if (matchingBracket !== closePairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("checks balanced enclosure of string with brackets", () => {
    expect(IsBalancedEnclosure("({})")).toBeTruthy();
    expect(IsBalancedEnclosure("([])(){}(())()()")).toBeTruthy();
    expect(IsBalancedEnclosure("(([])(){}(())()()")).toBeFalsy();
    expect(IsBalancedEnclosure("([])(){(}))")).toBeFalsy();
  });
}
