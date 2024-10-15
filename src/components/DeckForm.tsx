import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface DeckFormProps {
  onAddDeck: (name: string) => void;
}

const DeckForm: React.FC<DeckFormProps> = ({ onAddDeck }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddDeck(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Deck Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter deck name"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
      >
        <PlusCircle className="mr-2" size={20} />
        Add Deck
      </button>
    </form>
  );
};

export default DeckForm;