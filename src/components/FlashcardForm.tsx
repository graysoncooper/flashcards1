import React, { useState } from 'react';
import { Flashcard } from '../types';
import { PlusCircle } from 'lucide-react';

interface FlashcardFormProps {
  onAddFlashcard: (flashcard: Flashcard) => void;
  deckName: string;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onAddFlashcard, deckName }) => {
  const [face, setFace] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (face && info) {
      const newFlashcard: Flashcard = {
        id: Date.now().toString(),
        face,
        info,
      };
      onAddFlashcard(newFlashcard);
      setFace('');
      setInfo('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Flashcard to "{deckName}"</h2>
      <div className="mb-4">
        <label htmlFor="face" className="block text-sm font-medium text-gray-700 mb-1">
          Face Image URL
        </label>
        <input
          type="text"
          id="face"
          value={face}
          onChange={(e) => setFace(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="info" className="block text-sm font-medium text-gray-700 mb-1">
          Information
        </label>
        <textarea
          id="info"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter information about the person"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
      >
        <PlusCircle className="mr-2" size={20} />
        Add Flashcard
      </button>
    </form>
  );
};

export default FlashcardForm;