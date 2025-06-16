import { useState } from 'react'
import Players from './Players'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showPlayers, setShowPlayers] = useState([]);

  return (
    <>
      <Players setShowPlayers={setShowPlayers} />
    </>
  )
}

export default App
