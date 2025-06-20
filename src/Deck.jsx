import { useState, useEffect } from 'react'
import { CARDS } from './assets/cards.js'
import './Deck.css'

function makeCards(text) {
    const regex = /\sx(\d+.*)$/;
    let cards = [];
    let lines = text.split('\n');
    for (let line of lines) {
        const parts = line.split(regex);
        if (parts.length == 3) {
            let cardName = parts[0];
            let number = parts[1];
            cards.push({
                cardName,
                number,
            });
        } else {
            console.log('Unable to parse card: ', line);
        }
    }
    cards.sort((a, b) => {
        let a_data = CARDS[a.cardName];
        let b_data = CARDS[b.cardName];
        if (!a_data) {
            console.log(a.cardName);
            return -1;
        }
        if (!b_data) {
            console.log(b.cardName);
            return 1
        }
        // type
        if (a_data[0] != b_data[0]) {
            const TYPES = ['Attack', 'Skill', 'Power', 'Curse'];
            return TYPES.findIndex(x => x == a_data[0]) -
                TYPES.findIndex(x => x == b_data[0]);
        }
        // cost
        if (a_data[1] != b_data[1]) {
            if (a_data[1] == 'X') {
                return -1;
            } else if (b_data[1] == 'X') {
                return 1;
            }
            return a_data[1] - b_data[1];
        }
        // name
        if (a.cardName < b.cardName) {
            return -1;
        } else if (b.cardName < a.cardName) {
            return 1;
        }
        return 0;
    })

    return cards
}

function Deck({ player }) {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to perform data fetching when the component mounts
    useEffect(() => {
        // Set loading to true before starting the fetch
        setIsLoading(true);
        setError(null); // Clear any previous errors

        // Create an AbortController to cancel the fetch if the component unmounts
        const abortController = new AbortController();
        const signal = abortController.signal;

        // Perform the fetch request
        fetch(`https://proxy.ponderer.org/deck/${player}`, { signal })
        .then((response) => {
            // Check if the response was successful (status code 2xx)
            if (!response.ok) {
                // If not successful, throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            response.text().then((text) => {
                console.log(text);
                setCards(makeCards(text));
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

    return (
        <div className="deck">
            <strong>{player}</strong>
            {cards.map(card => {
                return (
                    <div key={card.cardName}>{card.cardName} x{card.number}</div>
                )
            })}
        </div>
    )
}

export default Deck
