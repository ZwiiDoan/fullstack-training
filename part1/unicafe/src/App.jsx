import { useState } from 'react'

const FeedbackButton = ({ text, onClickHandler }) => {
  return <button onClick={onClickHandler}>{text}</button>
}

const StatisticLine = ({ name, value }) => {
  return <tr><td>{name}</td><td>{value}</td></tr>
}

const Statistics = ({ bad, good, neutral }) => {
  const feedbackGiven = bad !== 0 || good !== 0 || neutral !== 0
  const all = good + bad + neutral
  const average = (good - bad) / all
  const positive = (good / all) * 100

  return <div>
    <h1>statistics</h1>
    {feedbackGiven ? <table><tbody>
      <StatisticLine name='good' value={good} />
      <StatisticLine name='neutral' value={neutral} />
      <StatisticLine name='bad' value={bad} />
      <StatisticLine name='all' value={all} />
      <StatisticLine name='average' value={average.toFixed(2)} />
      <StatisticLine name='positive' value={positive.toFixed(2) + '%'} />
    </tbody></table> : <p>No feedback given</p>}
  </div>
}

const App = () => {
  const [good, setGood] = useState(0)
  const [bad, setBad] = useState(0)
  const [neutral, setNeutral] = useState(0)

  const countFeedback = (feedback) => {
    switch (feedback) {
      case 'good':
        setGood(good + 1);
        break;
      case 'bad':
        setBad(bad + 1);
        break;
      case 'neutral':
        setNeutral(neutral + 1);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <FeedbackButton text='good' onClickHandler={() => countFeedback('good')} />
        <FeedbackButton text='bad' onClickHandler={() => countFeedback('bad')} />
        <FeedbackButton text='neutral' onClickHandler={() => countFeedback('neutral')} />
      </div>
      <Statistics bad={bad} good={good} neutral={neutral} />
    </div>
  )
}

export default App
