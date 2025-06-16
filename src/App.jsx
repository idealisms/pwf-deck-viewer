import { useState } from 'react'
import Players from './Players'
import './App.css'

function App() {
  const [showPlayers, setShowPlayers] = useState(new Set());

  return (
    <>
      <div className="toolbar">
        <Players showPlayers={showPlayers} setShowPlayers={setShowPlayers} />
      </div>
      <div>Selected decks:
        <div>
          {[...showPlayers].map(player => (
            <div key={player}>
              {player}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
