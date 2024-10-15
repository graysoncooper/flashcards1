import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardItemProps {
  flashcard: Flashcard;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 transform hover:scale-105"
      onClick={handleFlip}
      style={{ height: '300px' }}
    >
      <div className="w-full h-full relative">
        <div
          className={`absolute w-full h-full backface-hidden transition-transform duration-300 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          <img
            src={flashcard.face}
            alt="Person's face"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`absolute w-full h-full backface-hidden bg-blue-100 p-4 flex items-center justify-center transition-transform duration-300 ${
            isFlipped ? '' : 'rotate-y-180'
          }`}
        >
          <p className="text-center text-lg">{flashcard.info}</p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;