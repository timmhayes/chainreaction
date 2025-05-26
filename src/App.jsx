import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, Trophy, Clock, Lightbulb, AlertCircle } from 'lucide-react';
import './App.css'; // Custom styles if needed

const ChainReactionGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [chain, setChain] = useState([]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startWord, setStartWord] = useState('');
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [wordList, setWordList] = useState(new Set());
  const [loadingWords, setLoadingWords] = useState(false);
  const [wordListError, setWordListError] = useState(false);
  const [showAnimation, setShowAnimation] = useState(null);
  const [animationText, setAnimationText] = useState('');
  const [lastScore, setLastScore] = useState(0);

  const startWords = [
    'FIRE', 'OCEAN', 'MUSIC', 'LIGHT', 'DREAM', 'STORM', 'MAGIC', 'SPACE',
    'DANCE', 'HEART', 'TIGER', 'RIVER', 'CLOUD', 'SPARK', 'FROST', 'BLOOM'
  ];

  const hints = {
    'FIRE': 'Think heat, energy, or things that burn...',
    'OCEAN': 'Think water, waves, or sea creatures...',
    'MUSIC': 'Think sounds, instruments, or rhythm...',
    'LIGHT': 'Think brightness, sun, or illumination...',
    'DREAM': 'Think sleep, wishes, or imagination...',
    'STORM': 'Think weather, wind, or chaos...',
    'MAGIC': 'Think spells, wonder, or mystery...',
    'SPACE': 'Think stars, planets, or the cosmos...',
    'DANCE': 'Think movement, rhythm, or celebration...',
    'HEART': 'Think love, emotion, or the body...',
    'TIGER': 'Think stripes, jungle, or strength...',
    'RIVER': 'Think flowing water, nature, or journey...',
    'CLOUD': 'Think sky, weather, or floating...',
    'SPARK': 'Think electricity, inspiration, or small flames...',
    'FROST': 'Think cold, winter, or ice crystals...',
    'BLOOM': 'Think flowers, growth, or spring...'
  };

  // Load word list on component mount
  useEffect(() => {
    const loadWordList = async () => {
      setLoadingWords(true);
      try {
        // Try to load from external source
        const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt');
        if (!response.ok) throw new Error('Failed to load word list');
        
        const text = await response.text();
        const words = new Set(
          text.split('\n')
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length >= 3) // Only words 3+ letters
        );
        
        setWordList(words);
        setWordListError(false);
        console.log(`Loaded ${words.size} words successfully`);
      } catch (error) {
        console.error('Failed to load external word list:', error);
        setWordListError(true);
        
        // Comprehensive fallback word list
        const fallbackWords = new Set([
          // Common words for game testing
          'fire', 'heat', 'sun', 'light', 'bright', 'star', 'space', 'void', 'empty', 'full',
          'ocean', 'water', 'wave', 'sound', 'music', 'song', 'bird', 'fly', 'sky', 'cloud',
          'rain', 'storm', 'wind', 'tree', 'leaf', 'green', 'grass', 'earth', 'ground', 'rock',
          'stone', 'hard', 'soft', 'pillow', 'sleep', 'dream', 'night', 'dark', 'black', 'white',
          'snow', 'cold', 'ice', 'frozen', 'time', 'clock', 'hour', 'minute', 'second', 'fast',
          'slow', 'walk', 'run', 'race', 'finish', 'start', 'begin', 'new', 'old', 'young',
          'child', 'baby', 'small', 'big', 'large', 'huge', 'giant', 'tiny', 'little', 'mini',
          'micro', 'book', 'read', 'write', 'pen', 'paper', 'word', 'letter', 'alphabet',
          'dance', 'move', 'body', 'hand', 'foot', 'head', 'eye', 'see', 'look', 'watch',
          'tiger', 'cat', 'dog', 'animal', 'wild', 'tame', 'house', 'home', 'room', 'door',
          'window', 'glass', 'clear', 'see', 'through', 'air', 'breath', 'life', 'live',
          'love', 'heart', 'feel', 'emotion', 'happy', 'sad', 'angry', 'calm', 'peace',
          'war', 'fight', 'battle', 'win', 'lose', 'game', 'play', 'fun', 'joy', 'laugh',
          'smile', 'face', 'nose', 'mouth', 'teeth', 'bite', 'eat', 'food', 'hungry',
          'full', 'stomach', 'body', 'skin', 'touch', 'feel', 'warm', 'hot', 'cool',
          'temperature', 'weather', 'season', 'spring', 'summer', 'fall', 'winter',
          'bloom', 'flower', 'rose', 'red', 'color', 'paint', 'art', 'create', 'make',
          'build', 'construct', 'destroy', 'break', 'fix', 'repair', 'work', 'job',
          'money', 'rich', 'poor', 'wealth', 'gold', 'silver', 'metal', 'iron', 'steel',
          'strong', 'weak', 'power', 'energy', 'electric', 'spark', 'lightning', 'thunder',
          'loud', 'quiet', 'silence', 'noise', 'hear', 'listen', 'ear', 'deaf', 'blind',
          'magic', 'spell', 'witch', 'wizard', 'fantasy', 'real', 'fake', 'true', 'false',
          'lie', 'truth', 'honest', 'trust', 'friend', 'enemy', 'stranger', 'meet',
          'hello', 'goodbye', 'welcome', 'leave', 'stay', 'go', 'come', 'here', 'there',
          'where', 'when', 'how', 'why', 'what', 'who', 'question', 'answer', 'know',
          'learn', 'teach', 'school', 'student', 'teacher', 'lesson', 'test', 'grade',
          'pass', 'fail', 'try', 'attempt', 'success', 'failure', 'hope', 'fear',
          'brave', 'scared', 'afraid', 'courage', 'coward', 'hero', 'villain', 'good',
          'bad', 'evil', 'angel', 'devil', 'heaven', 'hell', 'god', 'pray', 'church',
          'religion', 'believe', 'faith', 'doubt', 'sure', 'maybe', 'possible', 'impossible'
        ]);
        
        setWordList(fallbackWords);
        console.log(`Using fallback word list with ${fallbackWords.size} words`);
      } finally {
        setLoadingWords(false);
      }
    };

    loadWordList();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setFeedback(`Time's up! Final score: ${score}`);
    }
  }, [timeLeft, gameStarted, gameOver, score]);

  const startNewGame = () => {
    const newStartWord = startWords[Math.floor(Math.random() * startWords.length)];
    setStartWord(newStartWord);
    setChain([newStartWord]);
    setUsedWords(new Set([newStartWord.toLowerCase()]));
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setCurrentWord('');
    setFeedback(`Start your chain from "${newStartWord}"!`);
    setTimeLeft(60);
    setGameStarted(true);
    setShowAnimation(null);
    setAnimationText('');
    setLastScore(0);
  };

  const isValidConnection = (word1, word2) => {
    // Simple validation - in a real game, you'd want more sophisticated connection checking
    // For now, we'll accept any word as long as it's not empty and not reused
    return word2.trim().length >= 3;
  };

  const isValidWord = (word) => {
    const lowerWord = word.toLowerCase();
    console.log(`Checking word: "${lowerWord}", Word list size: ${wordList.size}, Contains word: ${wordList.has(lowerWord)}`);
    
    if (wordListError || wordList.size === 0) {
      // If word list didn't load, be more lenient
      return word.length >= 3 && /^[a-zA-Z]+$/.test(word);
    }
    return wordList.has(lowerWord);
  };

  const triggerAnimation = (type, text, duration = 2000) => {
    setShowAnimation(type);
    setAnimationText(text);
    setTimeout(() => {
      setShowAnimation(null);
      setAnimationText('');
    }, duration);
  };

  const checkMilestones = (newScore, oldScore, wordLength, streakCount) => {
    // Score milestones
    const milestones = [50, 100, 150, 200, 300, 500];
    for (const milestone of milestones) {
      if (newScore >= milestone && oldScore < milestone) {
        const messages = {
          50: '🎉 First Milestone! 50 Points!',
          100: '🏆 Century Club! 100 Points!',
          150: '⭐ Rising Star! 150 Points!',
          200: '🔥 On Fire! 200 Points!',
          300: '💎 Diamond Tier! 300 Points!',
          500: '👑 LEGENDARY! 500 Points!'
        };
        triggerAnimation('milestone', messages[milestone], 3000);
        return;
      }
    }

    // Long word celebrations
    if (wordLength >= 8) {
      triggerAnimation('longword', `🤯 INCREDIBLE! ${wordLength} letters!`, 2500);
    } else if (wordLength >= 7) {
      triggerAnimation('longword', `🚀 AMAZING! ${wordLength} letters!`, 2000);
    } else if (wordLength >= 6) {
      triggerAnimation('longword', `✨ GREAT! ${wordLength} letters!`, 1500);
    }

    // Streak celebrations
    if (streakCount === 5) {
      triggerAnimation('streak', '🔥 5-Word Streak!', 2000);
    } else if (streakCount === 10) {
      triggerAnimation('streak', '💥 10-Word Combo!', 2500);
    } else if (streakCount === 15) {
      triggerAnimation('streak', '⚡ UNSTOPPABLE! 15 Words!', 3000);
    } else if (streakCount >= 20) {
      triggerAnimation('streak', '🌟 GODLIKE! 20+ Streak!', 3000);
    }
  };

  const submitWord = () => {
    const word = currentWord.trim().toUpperCase();
    
    if (!word) {
      setFeedback('Please enter a word!');
      return;
    }

    if (word.length < 3) {
      setFeedback('Words must be at least 3 letters long!');
      return;
    }

    if (!isValidWord(word)) {
      setFeedback(`"${word}" is not a valid English word!`);
      return;
    }

    if (usedWords.has(word.toLowerCase())) {
      setFeedback('You already used that word!');
      return;
    }

    if (word === startWord) {
      setFeedback('You cannot use the starting word again!');
      return;
    }

    const lastWord = chain[chain.length - 1];
    
    // Add the word to the chain
    const newChain = [...chain, word];
    const newUsedWords = new Set([...usedWords, word.toLowerCase()]);
    
    setChain(newChain);
    setUsedWords(newUsedWords);
    setCurrentWord('');
    
    // Calculate score
    let points = 10;
    if (word.length >= 6) points += 5; // Bonus for longer words
    if (word.length >= 8) points += 10; // Extra bonus for very long words
    if (streak >= 3) points += streak; // Streak bonus
    
    const newScore = score + points;
    const newStreak = streak + 1;
    
    setScore(newScore);
    setStreak(newStreak);
    setFeedback(`Nice! +${points} points. Chain length: ${newChain.length}`);
    
    // Check for milestone animations
    checkMilestones(newScore, score, word.length, newStreak);
    setLastScore(score);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitWord();
    }
  };

  const getScoreRating = () => {
    if (score >= 200) return { text: 'Word Wizard! 🧙‍♂️', color: 'text-purple-600' };
    if (score >= 150) return { text: 'Chain Master! 🏆', color: 'text-yellow-600' };
    if (score >= 100) return { text: 'Word Smith! ⚒️', color: 'text-blue-600' };
    if (score >= 50) return { text: 'Getting Good! 👍', color: 'text-green-600' };
    return { text: 'Keep Going! 💪', color: 'text-gray-600' };
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
          <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">⛓️ Chain Reaction</h1>
          
          {loadingWords && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-800">Loading word dictionary...</span>
              </div>
            </div>
          )}

          {wordListError && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-yellow-600" size={20} />
                <span className="text-yellow-800">Word validation will be basic (couldn't load full dictionary)</span>
              </div>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">How to Play:</h2>
            <div className="text-left space-y-2 text-gray-700">
              <p>• Build a chain of connected words starting from the given word</p>
              <p>• Each word must relate to the previous word somehow</p>
              <p>• Words must be at least 3 letters long and valid English words</p>
              <p>• No repeating words or using the start word again</p>
              <p>• You have 60 seconds to build the longest chain possible!</p>
              <p>• Longer words and streaks give bonus points</p>
            </div>
          </div>
          <button
            onClick={startNewGame}
            disabled={loadingWords}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingWords ? 'Loading...' : 'Start Playing!'}
          </button>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">⛓️ Chain Reaction</h1>
        <button
          onClick={startNewGame}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg transition-colors"
        >
          <RotateCcw size={16} />
          New Game
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="font-semibold">Score</span>
          </div>
          <div className={`text-2xl font-bold text-gray-800 transition-all duration-300 ${
            score > lastScore ? 'scale-110 text-green-600' : ''
          }`}>{score}</div>
          <div className={`text-sm ${getScoreRating().color} font-medium`}>
            {getScoreRating().text}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="text-red-500" size={20} />
            <span className="font-semibold">Time</span>
          </div>
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-800'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg text-center shadow-md">
          <span className="font-semibold block mb-2">Chain Length</span>
          <div className={`text-2xl font-bold text-gray-800 transition-all duration-500 ${
            chain.length > 1 ? 'animate-pulse text-blue-600' : ''
          }`}>{chain.length}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-500" size={20} />
          <span className="font-medium">Your Chain:</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {chain.map((word, index) => (
            <div key={index} className="flex items-center">
              <span className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                index === 0 
                  ? 'bg-green-100 text-green-800' 
                  : word.length >= 6 
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 shadow-lg transform hover:scale-105' 
                    : 'bg-blue-100 text-blue-800'
              } ${word.length >= 8 ? 'animate-pulse ring-2 ring-yellow-300' : ''}`}>
                {word}
                {word.length >= 6 && <span className="ml-1">✨</span>}
                {word.length >= 8 && <span className="ml-1">🌟</span>}
              </span>
              {index < chain.length - 1 && (
                <ArrowRight className="mx-2 text-gray-400" size={16} />
              )}
            </div>
          ))}
        </div>

        {!gameOver && (
          <div className="flex gap-2">
            <input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter next word..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={gameOver}
            />
            <button
              onClick={submitWord}
              disabled={gameOver || !currentWord.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {startWord && hints[startWord] && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-sm text-yellow-800">💡 Hint: {hints[startWord]}</span>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg mb-4 ${
          gameOver ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {feedback}
        </div>
      )}

      {streak >= 3 && !gameOver && (
        <div className={`text-center p-4 rounded-lg border mb-4 transition-all duration-500 ${
          streak >= 10 
            ? 'bg-gradient-to-r from-red-100 via-yellow-100 to-orange-100 border-red-300 animate-pulse' 
            : 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-200'
        }`}>
          <span className={`font-medium ${
            streak >= 10 ? 'text-red-800 text-lg' : 'text-orange-800'
          }`}>
            🔥 On fire! {streak} word streak!
            {streak >= 10 && ' 💥'}
            {streak >= 15 && ' ⚡'}
            {streak >= 20 && ' 🌟'}
          </span>
        </div>
      )}
    </div>
    
    {/* Animation Overlay */}
    {showAnimation && (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className={`transform transition-all duration-500 ${
          showAnimation === 'milestone' 
            ? 'animate-bounce text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500' 
            : showAnimation === 'longword'
            ? 'animate-pulse text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600'
            : 'animate-ping text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500'
        } drop-shadow-2xl`}>
          <div className="animate-pulse">{animationText}</div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ChainReactionGame;