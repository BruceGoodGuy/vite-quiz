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
      console.log("finish");
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
