import React, { useState, useEffect, useRef, useCallback } from 'react';
import words from '../data/Words';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../App.css';

const WordScramble = () => {
  const [scrambledWord, setScrambledWord] = useState('');
  const [hint, setHint] = useState('');
  const [correctWord, setCorrectWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  const shuffleWord = (word) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const pickRandomWord = useCallback(() => {
    const randomObj = words[Math.floor(Math.random() * words.length)];
    const shuffled = shuffleWord(randomObj.word);
    setScrambledWord(shuffled.toUpperCase());
    setHint(randomObj.hint);
    setCorrectWord(randomObj.word.toLowerCase());
    setUserInput('');
    setTimeLeft(30);
  },[]);

  const handleCheckWord = () => {
    if (!userInput) {
      toastr.error("Please enter the word to check!");
      return;
    }
    if (userInput.toLowerCase() === correctWord) {
      toastr.success(`Congrats! ${correctWord.toUpperCase()} is the correct word`);
      pickRandomWord();
    } else {
      toastr.error(`Oops! ${userInput} is not a correct word`);
    }
  };

  useEffect(() => {
    pickRandomWord();
  }, [pickRandomWord]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          toastr.error(`Time off! ${correctWord.toUpperCase()} was the correct word`);
          pickRandomWord();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [correctWord,pickRandomWord]);

  return (
    <div className="container">
      <h2>Word Scramble</h2>
      <div className="content">
        <p className="word">{scrambledWord}</p>
        <div className="details">
          <p className="hint">Hint: <span>{hint}</span></p>
          <p className="time">
            Time Left: <span><b>{timeLeft}</b>s</span>
          </p>
        </div>
        <input
          type="text"
          placeholder="Enter a valid word"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="buttons">
          <button className="refresh-word" onClick={pickRandomWord}>Refresh Word</button>
          <button className="check-word" onClick={handleCheckWord}>Check Word</button>
        </div>
      </div>
    </div>
  );
};

export default WordScramble;
