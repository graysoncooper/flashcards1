import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const DeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flashcards: [{
    face: String,
    info: String,
    difficulty: Number,
    nextReviewDate: Number,
  }],
});

const User = mongoose.model('User', UserSchema);
const Deck = mongoose.model('Deck', DeckSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

app.get('/api/decks', authenticateToken, async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user.userId });
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching decks' });
  }
});

app.post('/api/decks', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const deck = new Deck({ name, user: req.user.userId });
    await deck.save();
    res.status(201).json(deck);
  } catch (error) {
    res.status(500).json({ message: 'Error creating deck' });
  }
});

app.post('/api/decks/:deckId/flashcards', authenticateToken, async (req, res) => {
  try {
    const { deckId } = req.params;
    const { face, info } = req.body;
    const deck = await Deck.findOne({ _id: deckId, user: req.user.userId });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    const flashcard = { face, info, difficulty: 1, nextReviewDate: Date.now() };
    deck.flashcards.push(flashcard);
    await deck.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Error adding flashcard' });
  }
});

app.put('/api/decks/:deckId/flashcards/:flashcardId', authenticateToken, async (req, res) => {
  try {
    const { deckId, flashcardId } = req.params;
    const { difficulty, nextReviewDate } = req.body;
    const deck = await Deck.findOne({ _id: deckId, user: req.user.userId });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }
    const flashcard = deck.flashcards.id(flashcardId);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    flashcard.difficulty = difficulty;
    flashcard.nextReviewDate = nextReviewDate;
    await deck.save();
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating flashcard' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});