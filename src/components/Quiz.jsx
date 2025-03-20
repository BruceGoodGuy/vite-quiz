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
