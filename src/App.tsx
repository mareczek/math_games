import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import UpdateNotification from './components/UpdateNotification';
import './components/UpdateNotification.css';
import VersionDisplay from './components/VersionDisplay';
import './components/VersionDisplay.css';

// Import components from barrel file
import { Dashboard, GameContainer, Instructions, ResultScreen } from './components';

function App() {
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">Gra Matematyczna</h1>
        <Routes>
          <Route path="/" element={<Dashboard onSelectMode={setGameMode} />} />
          <Route
            path="/instructions"
            element={<Instructions mode={gameMode} />}
          />
          <Route
            path="/play"
            element={<GameContainer mode={gameMode} setScore={setScore} />}
          />
          <Route
            path="/results"
            element={<ResultScreen score={score} />}
          />
        </Routes>
        <UpdateNotification />
        <VersionDisplay />
      </div>
    </Router>
  );
}

export default App;
