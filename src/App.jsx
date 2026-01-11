import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { CardGame } from './game';
import Board from './Board';
import './App.css'

// Tạo boardgame.io client cho single player
const App = Client({
  game: CardGame,
  board: Board,
  numPlayers: 1,
  debug: false, // Đặt true để xem debug panel
});

export default App
