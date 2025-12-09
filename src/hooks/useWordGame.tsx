import confetti from "canvas-confetti";
import { useState } from "react";

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

const maxSkips = 3;
const maxAllowErrors = 3;

export const useWordGame = () => {
  const [words, setWords] = useState(shuffleArray(GAME_WORDS));

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [scrambledWord, setScrambledWord] = useState(scrambleWord(currentWord));
  const [guess, setGuess] = useState("");
  const [points, setPoints] = useState(0);
  const [errorCounter, setErrorCounter] = useState(0);

  const [skipCounter, setSkipCounter] = useState(0);

  const [isGameOver, setIsGameOver] = useState(false);

  const handleGuessSubmit = (e: React.FormEvent) => {
    // Previene el refresh de la página
    e.preventDefault();

    if (guess === currentWord) {
      const newWords = words.slice(1);

      confetti({ particleCount: 100, spread: 120, origin: { y: 0.6 } });

      setPoints(points + 1);
      setGuess("");
      setCurrentWord(currentWord);
      setWords(newWords);
      setCurrentWord(newWords[0]);
      setScrambledWord(scrambleWord(newWords[0]));
      return;
    }

    setErrorCounter(errorCounter + 1);
    setGuess("");

    if (errorCounter + 1 >= maxAllowErrors) {
      setIsGameOver(true);
    }
  };

  const handleSkip = () => {
    if (skipCounter >= maxSkips) return;

    const updatedWords = words.slice(1);
    setSkipCounter(skipCounter + 1);
    setWords(updatedWords);
    setCurrentWord(updatedWords[0]);
    setScrambledWord(scrambleWord(updatedWords[0]));
    setGuess("");
  };

  const handlePlayAgain = () => {
    const newArray = shuffleArray(GAME_WORDS);

    setIsGameOver(false);
    setErrorCounter(0);
    setPoints(0);
    setGuess("");
    setWords(newArray);
    setCurrentWord(newArray[0]);
    setSkipCounter(0);
    setScrambledWord(scrambleWord(newArray[0]));
  };

  return {
    handleGuessSubmit,
    handlePlayAgain,
    handleSkip,

    GAME_WORDS,
    words,
    skipCounter,
    errorCounter,
    points,
    isGameOver,
    currentWord,
    scrambledWord,
    setGuess,
    guess,
    maxSkips,
    maxAllowErrors,
  };
};
