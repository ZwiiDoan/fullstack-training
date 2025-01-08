import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)

  const randomInt = (max) => {
    return Math.floor(Math.random() * (max + 1))
  }

  const udpateVotes = () => {
    const newVotes = [...votes]
    newVotes[selected]++

    if (newVotes[selected] > newVotes[maxIndex]) {
      setMaxIndex(selected)
    }

    setVotes(newVotes)
  }

  const nextAnecdote = () => {
    setSelected(randomInt(anecdotes.length - 1))
  }

  const Ancedote = ({ anecdote, votes }) => {
    return <>
      <h1>Anecdote of the day</h1>
      <div>
        {anecdote}
      </div>
      <div>
        has {votes} votes
      </div>
    </>
  }

  const MaxVotedAncedote = ({ ancedote }) => {
    return <>
      <h1>Anecdote with most votes</h1>
      <div>{ancedote}</div>
    </>
  }

  const AncedoteButton = ({ text, onClickHandler }) => {
    return <button onClick={onClickHandler}>{text}</button>
  }

  return (
    <div>
      <Ancedote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <AncedoteButton text={'vote'} onClickHandler={udpateVotes}/>
      <AncedoteButton text={'next ancedote'} onClickHandler={nextAnecdote}/>
      <MaxVotedAncedote ancedote={anecdotes[maxIndex]} />
    </div>
  )
}

export default App