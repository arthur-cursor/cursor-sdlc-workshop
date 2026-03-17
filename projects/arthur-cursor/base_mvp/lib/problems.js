/**
 * Integer Pythagorean triples — friendly for learners (whole-number answers).
 */
const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [12, 16, 20],
  [15, 20, 25],
  [20, 21, 29],
  [10, 24, 26],
];

const MODES = ["hypotenuse", "legA", "legB"];

/**
 * @returns {{ answer: number, prompt: string, mode: string }}
 */
export function randomProblem() {
  const [a, b, c] = TRIPLES[Math.floor(Math.random() * TRIPLES.length)];
  const mode = MODES[Math.floor(Math.random() * MODES.length)];

  if (mode === "hypotenuse") {
    return {
      answer: c,
      mode,
      prompt: `The two legs of a right triangle are ${a} and ${b}. What is the length of the hypotenuse?`,
    };
  }
  if (mode === "legA") {
    return {
      answer: a,
      mode,
      prompt: `One leg is ${b} and the hypotenuse is ${c}. What is the length of the other leg?`,
    };
  }
  return {
    answer: b,
    mode,
    prompt: `One leg is ${a} and the hypotenuse is ${c}. What is the length of the other leg?`,
  };
}
