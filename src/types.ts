export interface Flashcard {
  _id: string;
  face: string;
  info: string;
  difficulty: number;
  nextReviewDate: number;
}

export interface Deck {
  _id: string;
  name: string;
  flashcards: Flashcard[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
}