interface WordGameSate {
  words: string[];
  currentWord: string;
  scrambledWord: string;
  guess: string;
  points: number;
  errorCounter: number;
  maxAllowErrors: number;
  maxSkips: number;
  skipCounter: number;
  totalWords: number;
  isGameOver: boolean;
}

const GAME_WORDS = [
  "REACT",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "HTML",
  "ANGULAR",
  "SOLID",
  "NODE",
  "VUEJS",
  "SVELTE",
  "EXPRESS",
  "MONGODB",
  "POSTGRES",
  "DOCKER",
  "KUBERNETES",
  "WEBPACK",
  "VITE",
  "TAILWIND",
];

// Esta función mezcla el arreglo para que siempre sea aleatorio
const shuffleArray = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5);
};

// Esta función mezcla las letras de la palabra
const scrambleWord = (word: string = "") => {
  return word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export const getInitialState = (): WordGameSate => {
  const newArray = shuffleArray([...GAME_WORDS]);

  return {
    words: shuffleArray(newArray),
    currentWord: newArray[0],
    scrambledWord: scrambleWord(newArray[0]),
    guess: "",
    points: 0,
    maxAllowErrors: 3,
    maxSkips: 3,
    errorCounter: 0,
    skipCounter: 0,
    totalWords: newArray.length,
    isGameOver: false,
  };
};

export type ScrambledActions =
  | { type: "GUESS"; payload: string }
  | { type: "CHECK_ANSWER" }
  | { type: "SKIP_WORD" }
  | { type: "PLAY_AGAIN"; payload: WordGameSate };

export const WordGameReducer = (
  state: WordGameSate,
  action: ScrambledActions
) => {
  switch (action.type) {
    case "GUESS":
      return {
        ...state,
        guess: action.payload.trim().toUpperCase(),
      };

    case "CHECK_ANSWER":
      if (state.guess === state.currentWord) {
        const newWords = state.words.slice(1);

        return {
          ...state,
          words: newWords,
          guess: "",
          points: state.points + 1,
          currentWord: newWords[0],
          scrambledWord: scrambleWord(newWords[0]),
        };
      }

      return {
        ...state,
        guess: "",
        errorCounter: state.errorCounter + 1,
        isGameOver: state.errorCounter + 1 >= state.maxAllowErrors,
      };

    case "SKIP_WORD": {
      if (state.skipCounter >= state.maxSkips) {
        return state;
      }
      const newWords = state.words.slice(1);

      return {
        ...state,
        words: newWords,
        guess: "",
        skipCounter: state.skipCounter + 1,
        currentWord: newWords[0],
        scrambledWord: scrambleWord(newWords[0]),
      };
    }

    case "PLAY_AGAIN":
      return action.payload;

    default:
      return state;
  }
};
