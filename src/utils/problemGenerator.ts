export interface MathProblem {
  firstNumber: number;
  secondNumber: number;
  operator: string;
  answer: number;
}

/**
 * Generates a random number between min and max (inclusive)
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates an addition problem suitable for 8-year-olds
 */
export const generateAdditionProblem = (): MathProblem => {
  // For 8-year-olds, we'll use numbers between 1 and 10
  const firstNumber = getRandomNumber(1, 10);
  const secondNumber = getRandomNumber(1, 10);

  return {
    firstNumber,
    secondNumber,
    operator: '+',
    answer: firstNumber + secondNumber,
  };
};

/**
 * Generates a subtraction problem suitable for 8-year-olds
 * Ensures the answer is always positive
 */
export const generateSubtractionProblem = (): MathProblem => {
  // For subtraction, ensure first number is larger than second
  const firstNumber = getRandomNumber(5, 15);
  const secondNumber = getRandomNumber(1, Math.min(firstNumber - 1, 10));

  return {
    firstNumber,
    secondNumber,
    operator: '-',
    answer: firstNumber - secondNumber,
  };
};

/**
 * Generates a mixed problem (either addition or subtraction)
 */
export const generateMixedProblem = (): MathProblem => {
  // Randomly choose between addition and subtraction
  const isAddition = Math.random() > 0.5;

  return isAddition ? generateAdditionProblem() : generateSubtractionProblem();
};

/**
 * Generates a problem based on the specified mode
 */
export const generateProblem = (mode: string): MathProblem => {
  switch (mode) {
    case 'addition':
      return generateAdditionProblem();
    case 'subtraction':
      return generateSubtractionProblem();
    case 'mixed':
      return generateMixedProblem();
    default:
      return generateAdditionProblem(); // Default to addition
  }
};

/**
 * Generates an array of problems for a game session
 */
export const generateGameProblems = (mode: string, count: number = 5): MathProblem[] => {
  const problems: MathProblem[] = [];

  for (let i = 0; i < count; i++) {
    problems.push(generateProblem(mode));
  }

  return problems;
};