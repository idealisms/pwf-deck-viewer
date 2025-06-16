import { useState } from 'react'
import Players from './Players'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showPlayers, setShowPlayers] = useState(new Set());

  return (
    <>
      <Players showPlayers={showPlayers} setShowPlayers={setShowPlayers} />
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
