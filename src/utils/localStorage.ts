import { MathProblem } from './problemGenerator';

export interface GameExecution {
  id: string;
  timestamp: number;
  mode: string;
  correctAnswers: number;
  totalProblems: number;
  wrongAnswers: MathProblem[];
  userAnswers: number[];
}

const STORAGE_KEY_PREFIX = 'mathGame_history_';

/**
 * Saves a game execution to localStorage
 */
export const saveGameExecution = (
  mode: string,
  correctAnswers: number,
  totalProblems: number,
  wrongAnswers: MathProblem[],
  userAnswers: number[]
): void => {
  const gameExecution: GameExecution = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    mode,
    correctAnswers,
    totalProblems,
    wrongAnswers,
    userAnswers
  };

  const storageKey = `${STORAGE_KEY_PREFIX}${mode}`;
  const existingData = getGameExecutions(mode);
  const updatedData = [...existingData, gameExecution];

  localStorage.setItem(storageKey, JSON.stringify(updatedData));
};

/**
 * Gets all game executions for a specific mode
 */
export const getGameExecutions = (mode: string): GameExecution[] => {
  const storageKey = `${STORAGE_KEY_PREFIX}${mode}`;
  const data = localStorage.getItem(storageKey);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as GameExecution[];
  } catch (error) {
    console.error('Error parsing game history:', error);
    return [];
  }
};

/**
 * Clears all game executions for a specific mode
 */
export const clearGameExecutions = (mode: string): void => {
  const storageKey = `${STORAGE_KEY_PREFIX}${mode}`;
  localStorage.removeItem(storageKey);
};

/**
 * Formats a timestamp to a readable date string
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};