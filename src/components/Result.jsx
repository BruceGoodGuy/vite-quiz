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
        {
          <div className="score">
            <h2>
              Score:{" "}
              {Object.values(questions.answer).filter((answer) => answer.isCorrect).length} / {questionList.length}
            </h2>
          </div>
        }
      </div>
    </div>
  );
}
