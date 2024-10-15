import React, { useState, useEffect } from 'react';
import { Deck, Flashcard, User } from './types';
import DeckList from './components/DeckList';
import DeckForm from './components/DeckForm';
import FlashcardList from './components/FlashcardList';
import FlashcardForm from './components/FlashcardForm';
import StudyMode from './components/StudyMode';
import Login from './components/Login';
import { Brain, ArrowLeft, BookOpen, PlusCircle, X, LogOut } from 'lucide-react';

function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [showAddFlashcard, setShowAddFlashcard] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        fetchDecks(token);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDecks = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/decks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const decksData = await response.json();
        setDecks(decksData);
      }
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  };

  const handleLogin = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setDecks([]);
    setSelectedDeck(null);
    setIsStudyMode(false);
    setShowAddFlashcard(false);
  };

  const handleAddDeck = async (name: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        const newDeck = await response.json();
        setDecks([...decks, newDeck]);
      }
    } catch (error) {
      console.error('Error adding deck:', error);
    }
  };

  const handleSelectDeck = (deckId: string) => {
    const deck = decks.find((d) => d._id === deckId);
    if (deck) {
      setSelectedDeck(deck);
      setShowAddFlashcard(false);
    }
  };

  const handleAddFlashcard = async (newFlashcard: Flashcard) => {
    if (selectedDeck) {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:3001/api/decks/${selectedDeck._id}/flashcards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newFlashcard)
        });
        if (response.ok) {
          const updatedFlashcard = await response.json();
          const updatedDeck = {
            ...selectedDeck,
            flashcards: [...selectedDeck.flashcards, updatedFlashcard],
          };
          setSelectedDeck(updatedDeck);
          setDecks(decks.map((d) => (d._id === updatedDeck._id ? updatedDeck : d)));
          setShowAddFlashcard(false);
        }
      } catch (error) {
        console.error('Error adding flashcard:', error);
      }
    }
  };

  const handleUpdateFlashcard = async (updatedFlashcard: Flashcard) => {
    if (selectedDeck) {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:3001/api/decks/${selectedDeck._id}/flashcards/${updatedFlashcard._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedFlashcard)
        });
        if (response.ok) {
          const updatedFlashcards = selectedDeck.flashcards.map((card) =>
            card._id === updatedFlashcard._id ? updatedFlashcard : card
          );
          const updatedDeck = {
            ...selectedDeck,
            flashcards: updatedFlashcards,
          };
          setSelectedDeck(updatedDeck);
          setDecks(decks.map((d) => (d._id === updatedDeck._id ? updatedDeck : d)));
        }
      } catch (error) {
        console.error('Error updating flashcard:', error);
      }
    }
  };

  const handleBackToDeckList = () => {
    setSelectedDeck(null);
    setIsStudyMode(false);
    setShowAddFlashcard(false);
  };

  const handleStartStudyMode = () => {
    setIsStudyMode(true);
    setShowAddFlashcard(false);
  };

  const handleExitStudyMode = () => {
    setIsStudyMode(false);
  };

  const toggleAddFlashcard = () => {
    setShowAddFlashcard(!showAddFlashcard);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-800 flex items-center">
            <Brain className="mr-2" size={32} />
            Flashcard App
          </h1>
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors duration-300 flex items-center"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </header>
        {selectedDeck ? (
          <>
            <button
              onClick={handleBackToDeckList}
              className="mb-4 flex items-center text-yellow-700 hover:text-yellow-800"
            >
              <ArrowLeft className="mr-1" size={20} />
              Back to Deck List
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-800">{selectedDeck.name}</h2>
            {isStudyMode ? (
              <StudyMode
                flashcards={selectedDeck.flashcards}
                onExit={handleExitStudyMode}
                onUpdateFlashcard={handleUpdateFlashcard}
              />
            ) : (
              <>
                <div className="flex justify-between mb-6">
                  <button
                    onClick={handleStartStudyMode}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center"
                  >
                    <BookOpen className="mr-2" size={20} />
                    Start Studying
                  </button>
                  <button
                    onClick={toggleAddFlashcard}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors duration-300 flex items-center"
                  >
                    {showAddFlashcard ? (
                      <>
                        <X className="mr-2" size={20} />
                        Cancel
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2" size={20} />
                        Add Flashcard
                      </>
                    )}
                  </button>
                </div>
                {showAddFlashcard ? (
                  <div className="mb-8">
                    <FlashcardForm onAddFlashcard={handleAddFlashcard} deckName={selectedDeck.name} />
                  </div>
                ) : (
                  <FlashcardList flashcards={selectedDeck.flashcards} />
                )}
              </>
            )}
          </>
        ) : (
          <>
            <DeckForm onAddDeck={handleAddDeck} />
            <DeckList decks={decks} onSelectDeck={handleSelectDeck} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;