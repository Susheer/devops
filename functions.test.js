const functions = require("./functions");

test("Adds 2 + 2 to equal 4", () => {
  expect(functions.add(2, 2)).toBe(4);
});

test("Subs 2 - 2 to equal 0", () => {
  expect(functions.sub(2, 2)).toBe(0);
});
