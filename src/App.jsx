import { useState } from 'react'
import './App.css'
import QuizProvider from './store'
import { questions } from './data/questions'
import Quiz from './components/Quiz'

function App() {
  const [count, setCount] = useState(0)

  return (
    <QuizProvider>
      <Quiz></Quiz>
    </QuizProvider>
  )
}

export default App
