import { createContext, useState, useReducer } from "react";

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
