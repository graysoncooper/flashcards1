import React from 'react';
import { Deck } from '../types';
import { FolderOpen } from 'lucide-react';

interface DeckListProps {
  decks: Deck[];
  onSelectDeck: (deckId: string) => void;
}

const DeckList: React.FC<DeckListProps> = ({ decks, onSelectDeck }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => onSelectDeck(deck.id)}
        >
          <div className="flex items-center mb-2">
            <FolderOpen className="mr-2 text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">{deck.name}</h3>
          </div>
          <p className="text-gray-600">{deck.flashcards.length} flashcards</p>
        </div>
      ))}
    </div>
  );
};

export default DeckList;