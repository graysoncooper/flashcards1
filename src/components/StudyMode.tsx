import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import FlashcardItem from './FlashcardItem';
import { ArrowLeft, X, Check, Star } from 'lucide-react';

interface StudyModeProps {
  flashcards: Flashcard[];
  onExit: () => void;
  onUpdateFlashcard: (updatedFlashcard: Flashcard) => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ flashcards, onExit, onUpdateFlashcard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);

  useEffect(() => {
    const now = Date.now();
    const sortedFlashcards = flashcards
      .filter((card) => card.nextReviewDate <= now)
      .sort((a, b) => a.nextReviewDate - b.nextReviewDate);
    setStudyQueue(sortedFlashcards);
  }, [flashcards]);

  const updateFlashcard = (difficulty: number) => {
    if (studyQueue.length === 0) return;

    const currentCard = studyQueue[currentIndex];
    const now = Date.now();
    let nextReviewDate: number;

    switch (difficulty) {
      case 0: // Hard
        nextReviewDate = now + 1 * 24 * 60 * 60 * 1000; // 1 day
        break;
      case 1: // Good
        nextReviewDate = now + 3 * 24 * 60 * 60 * 1000; // 3 days
        break;
      case 2: // Easy
        nextReviewDate = now + 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      default:
        nextReviewDate = now;
    }

    const updatedCard: Flashcard = {
      ...currentCard,
      difficulty,
      nextReviewDate,
    };

    onUpdateFlashcard(updatedCard);

    const newQueue = studyQueue.filter((_, index) => index !== currentIndex);
    setStudyQueue(newQueue);

    if (newQueue.length > 0) {
      setCurrentIndex(0);
    } else {
      onExit();
    }
  };

  if (studyQueue.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xl mb-4">Great job! You've completed all the flashcards for now.</p>
        <button
          onClick={onExit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Back to Deck
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md mb-8">
        <FlashcardItem flashcard={studyQueue[currentIndex]} />
      </div>
      <div className="flex justify-between w-full max-w-md">
        <button
          onClick={() => updateFlashcard(0)}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center"
        >
          <X className="mr-2" size={20} />
          Hard
        </button>
        <button
          onClick={() => updateFlashcard(1)}
          className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors duration-300 flex items-center"
        >
          <Check className="mr-2" size={20} />
          Good
        </button>
        <button
          onClick={() => updateFlashcard(2)}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center"
        >
          <Star className="mr-2" size={20} />
          Easy
        </button>
      </div>
      <button
        onClick={onExit}
        className="mt-8 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300 flex items-center"
      >
        <ArrowLeft className="mr-2" size={20} />
        Exit Study Mode
      </button>
    </div>
  );
};

export default StudyMode;