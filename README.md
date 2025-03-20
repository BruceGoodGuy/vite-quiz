# Vite Quiz Application

This project is a simple quiz application built with React and Vite. It allows users to answer multiple-choice questions and see their results at the end.

## Project Structure

The project has the following structure:

```
.gitignore
eslint.config.js
index.html
package.json
public/
  vite.svg
README.md
src/
  App.css
  App.jsx
  assets/
    react.svg
  components/
    ProgressBar.jsx
    Question.jsx
    Quiz.jsx
    Result.jsx
  data/
    questions.js
  index.css
  main.jsx
  store/
    index.jsx
vite.config.js
```

### Key Files and Directories

- `index.html`: The main HTML file that includes the root div for the React application.
- `src/main.jsx`: The entry point of the React application. It renders the `App` component inside the root div.
- `src/App.jsx`: The main component that sets up the `QuizProvider` context and renders the `Quiz` component.
- `src/store/index.jsx`: Contains the context and reducer logic for managing quiz state.
- `src/components/`: Contains the React components used in the application.
  - `ProgressBar.jsx`: A component that displays a progress bar and handles timeout logic.
  - `Question.jsx`: A component that displays a quiz question and handles user answers.
  - `Quiz.jsx`: A component that manages the quiz flow and displays either the `Question` or `Result` component.
  - `Result.jsx`: A component that displays the quiz results.
- `src/data/questions.js`: Contains the list of quiz questions.
- `src/App.css` and `src/index.css`: CSS files for styling the application.

## Code Explanation

### `src/main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

This file is the entry point of the React application. It imports the necessary modules and renders the `App` component inside the root div.

### App.jsx

```jsx
import { useState } from 'react';
import './App.css';
import QuizProvider from './store';
import Quiz from './components/Quiz';

function App() {
  return (
    <QuizProvider>
      <Quiz />
    </QuizProvider>
  );
}

export default App;
```

The `App` component sets up the `QuizProvider` context and renders the `Quiz` component.

### index.jsx

```jsx
import { createContext, useReducer } from "react";

export const QuizContext = createContext(null);

export default function QuizProvider({ children }) {
  const [questions, dispatchQuestions] = useReducer(questionReducer, {
    answer: {},
    isFinish: false,
  });

  function questionReducer(state, action) {
    switch (action.type) {
      case "SET_ANSWER":
        return {
          ...state,
          answer: {
            ...state.answer,
            [action.payload.id]: {
              answer: action.payload.option,
              isCorrect: action.payload.isCorrect,
            },
          },
        };
      case "SET_FINISH":
        return {
          ...state,
          isFinish: true,
        };
      default:
        return state;
    }
  }

  return (
    <QuizContext.Provider value={{ dispatchQuestions, questions }}>
      {children}
    </QuizContext.Provider>
  );
}
```

This file contains the context and reducer logic for managing the quiz state. The `QuizProvider` component provides the `QuizContext` to its children.

### Quiz.jsx

```jsx
import { useContext } from "react";
import Question from "./Question";
import Result from "./Result";
import { QuizContext } from "../store";

export default function Quiz() {
  const { questions } = useContext(QuizContext);
  return (
    <div>
      <h1>Quiz</h1>
      {questions.isFinish ? <Result /> : <Question />}
    </div>
  );
}
```

The `Quiz` component manages the quiz flow and displays either the `Question` or `Result` component based on the quiz state.

### Question.jsx

```jsx
import { useCallback, useState, useRef, useContext } from "react";
import { questions } from "../data/questions";
import ProgressBar from "./ProgressBar";
import { QuizContext } from "../store";

function getQuestionIdRandomly(cloneQuestions) {
  return Math.floor(Math.random() * cloneQuestions.length);
}

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export default function Question() {
  const { dispatchQuestions } = useContext(QuizContext);

  let cloneQuestions = useRef([
    ...questions.map((question) => ({ ...question })),
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(
    cloneQuestions.current[getQuestionIdRandomly(cloneQuestions.current)]
  );

  const changeQuestion = useCallback(() => {
    cloneQuestions.current.splice(
      cloneQuestions.current.indexOf(currentQuestion),
      1
    );
    if (cloneQuestions.current.length === 0) {
      dispatchQuestions({
        type: "SET_FINISH",
      });
    }
    const nextQuestion = getQuestionIdRandomly(cloneQuestions.current);
    setCurrentQuestion(cloneQuestions.current[nextQuestion]);
  }, [currentQuestion]);

  const selectAnswer = function (id, option) {
    dispatchQuestions({
      type: "SET_ANSWER",
      payload: {
        id,
        option,
        isCorrect: currentQuestion.correctAnswer === option,
      },
    });
    changeQuestion();
  };

  return (
    <>
      <h1>
        Question {questions.length - cloneQuestions.current.length + 1} /{" "}
        {questions.length}
      </h1>
      <div className="quiz-container">
        <ProgressBar time={5000} isTimeOut={changeQuestion} />
        {cloneQuestions.current.length != 1 && (
          <button onClick={changeQuestion}>Skip</button>
        )}
        <h1>{currentQuestion.question}</h1>
        <div className="options">
          {shuffleArray(currentQuestion.options).map((option, index) => {
            return (
              <button
                className="option"
                key={index}
                onClick={() => selectAnswer(currentQuestion.id, option)}
              >
                {index + 1}. {option}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
```

The `Question` component displays a quiz question and handles user answers. It also includes a progress bar and a skip button.

### Result.jsx

```jsx
import React, { useContext } from "react";
import { QuizContext } from "../store";
import { questions as questionList } from "../data/questions";

export default function Result() {
  const { questions } = useContext(QuizContext);
  return (
    <div className="result-container">
      <div className="container">
        <h1>Quiz Results</h1>
        {questionList.map((question, index) => {
          const userAnswer = questions.answer[question.id];
          return (
            <div
              key={index}
              className={
                "question " +
                (userAnswer && userAnswer.isCorrect ? "correct" : "incorrect")
              }
            >
              <p>
                <strong>
                  {index + 1}: {question.question}
                </strong>
              </p>
              <p>Your answer: {userAnswer ? userAnswer.answer : null}</p>
              <p>Correct answer: {question.correctAnswer}</p>
              <p>
                <em>{userAnswer?.isCorrect ? "Correct" : "Incorrect"}</em>
              </p>
            </div>
          );
        })}
        <div className="score">
          <h2>
            Score:{" "}
            {Object.values(questions.answer).filter((answer) => answer.isCorrect).length} / {questionList.length}
          </h2>
        </div>
      </div>
    </div>
  );
}
```

The `Result` component displays the quiz results, including the user's answers and the correct answers.

### ProgressBar.jsx

```jsx
import { useEffect, useRef } from "react";

export default function ProgressBar({ time, isTimeOut }) {
  const progressBar = useRef(null);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      isTimeOut();
    }, time);
    return () => clearTimeout(timeoutId);
  }, [time, isTimeOut]);
  useEffect(() => {
    let timer = 0;
    const intervalId = setInterval(() => {
      timer += 10;
      if (timer >= time) {
        clearInterval(intervalId);
      }
      progressBar.current.querySelector(".progress").style.width = `${
        (timer / time) * 100
      }%`;
    }, 10);
    return () => clearInterval(intervalId);
  });
  return (
    <div ref={progressBar} className="progress-bar">
      <div className="progress" id="progress"></div>
    </div>
  );
}
```

The `ProgressBar` component displays a progress bar and handles timeout logic.

### questions.js

```js
export const questions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'New York', 'Paris', 'Dublin'],
    correctAnswer: 'Paris'
  },
  {
    id: 2,
    question: 'Who is CEO of Tesla?',
    options: ['Jeff Bezos', 'Elon Musk', 'Bill Gates', 'Tony Stark'],
    correctAnswer: 'Elon Musk'
  },
  {
    id: 3,
    question: 'The iPhone was created by which company?',
    options: ['Apple', 'Intel', 'Amazon', 'Microsoft'],
    correctAnswer: 'Apple'
  },
  {
    id: 4,
    question: 'How many Harry Potter books are there?',
    options: ['1', '4', '6', '7'],
    correctAnswer: '7'
  },
  {
    id: 5,
    question: 'How many continents are there?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '7'
  },
];
```

This file contains the list of quiz questions.

## Running the Project

To run the project, use the following commands:

```sh
npm install
npm run dev
```

This will start the development server and open the application in your default browser.

## Building the Project

To build the project for production, use the following command:

```sh
npm run build
```

This will create a `dist` directory with the production build of the application.

## Linting the Project

To lint the project, use the following command:

```sh
npm run lint
```

This will run ESLint on the project files and report any linting errors.

## License

This project is licensed under the MIT License.
```

This `README.md` file provides an overview of the project structure, explains the key files and their logic, and includes instructions for running, building, and linting the project.
This `README.md` file provides an overview of the project structure, explains the key files and their logic, and includes instructions for running, building, and linting the project.

Similar code found with 2 license types