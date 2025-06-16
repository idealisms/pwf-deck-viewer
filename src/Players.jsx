import { useState, useEffect } from 'react'
import './Players.css'

function Players({ showPlayers, setShowPlayers }) {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClosed, setIsClosed] = useState(true)

  // useEffect hook to perform data fetching when the component mounts
  useEffect(() => {
    // Set loading to true before starting the fetch
    setIsLoading(true);
    setError(null); // Clear any previous errors

    // Create an AbortController to cancel the fetch if the component unmounts
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Perform the fetch request
    fetch('https://slay-the-relics.baalorlord.tv/players', { signal })
      .then((response) => {
        // Check if the response was successful (status code 2xx)
        if (!response.ok) {
          // If not successful, throw an error
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        response.json().then((json) => {
          json.players.sort();
          setPlayers(json.players);
        });
      })
      .catch((err) => {
        // Only set error if it's not an abort error (component unmounted)
        if (err.name === 'AbortError') {
          console.log('Fetch aborted:', err.message);
        } else {
          // Set the error state if fetching fails
          console.error("Error fetching players:", err);
          setError(err.message);
        }
      })
      .finally(() => {
        // Set loading to false once the fetch is complete (success or error)
        setIsLoading(false);

      })

    // Cleanup function: runs when the component unmounts or before re-running the effect
    return () => {
      // Abort the ongoing fetch request to prevent memory leaks
      // and "Can't perform a React state update on an unmounted component" warning
      // if the component unmounts before the fetch completes.
      // This is particularly useful for long-running requests or if the component
      // might unmount quickly (e.g., in a navigation flow).
      // abortController.abort(); // Uncomment this line if you want to implement aborting
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleCheckboxChange = (user, isChecked) => {
    setShowPlayers(prevShowPlayers => {
      const newSet = new Set(prevShowPlayers); // Create a new Set to avoid direct mutation
      if (isChecked) {
        newSet.add(user);
      } else {
        newSet.delete(user);
      }
      return newSet;
    });
  };

  return (
    <div className="players">
      <button className="placeholder" onClick={() => setIsClosed(!isClosed)}>players</button>
      <div className={`menu ${isClosed ? "closed" : ""}`}>
        {isLoading && (
            <div>Loading players...</div>
        )}
        {error && (
            <div>Error: {error}</div>
        )}

        {!isLoading && !error && players.length > 0 && (
          <ul>
            {players.map(player => (
              <li key={player}>
                <input
                  type="checkbox"
                  id={`player-${player}`}
                  checked={showPlayers.has(player)}
                  onChange={(e) => handleCheckboxChange(player, e.target.checked)}
                />
                <label htmlFor={`player-${player}`}>{player}</label>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && !error && players.length === 0 && (
          <div>No players found.</div>
        )}
      </div>
    </div>
  )
}

export default Players
