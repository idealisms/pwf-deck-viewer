import { useState } from 'react'
import Deck from './Deck'
import Players from './Players'
import './App.css'

function App() {
  const [showPlayers, setShowPlayers] = useState(new Set());

  return (
    <>
      <div id="toolbar">
        <Players showPlayers={showPlayers} setShowPlayers={setShowPlayers} />
      </div>
      <div id="decks">
          {[...showPlayers].map(player => (
            <Deck className="deck" key={player} player={player} />
          ))}
      </div>
    </>
  )
}

export default App
