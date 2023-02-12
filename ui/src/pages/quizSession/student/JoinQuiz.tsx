import React, { useState, useRef, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import SOCKET_URL from "../../../common/components";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { Quiz, initialQuizAnswers, QuizAnswers } from "../../../common/types";
import { Prompt } from "react-router";

import "./index.css";
import JoinForm from "./joinForm/JoinForm";
import AnswerToQuestion from "./answerToQuestion/AnswerToQuestion";
import { mergeSort } from "../../helperMethods";

interface ResponseMessage {
  responseType: string;
}

interface JoinSessionResponse extends ResponseMessage {
  quiz: Quiz;
  responseStatus: string;
}

interface nextQuestionMessage extends ResponseMessage {
  questionKey: number;
}

interface resultMessage extends ResponseMessage {
  correctAnswers: number;
}

//When student answers, the data are sent in this format to the server
interface QuestionAnswer {
  sessionId: number;
  questionKey: number;
  topLeftAnswer: boolean;
  topRightAnswer: boolean;
  bottomLeftAnswer: boolean;
  bottomRightAnswer: boolean;
}

//Response status to join session request
const responseStatus = {
  CONNECTED: "CONNECTED",
  SESSIONNOTFOUND: "NOTFOUND",
  NAMEEXISTS: "NAMEEXISTS",
};

//Response types, used to determine which type of message came from the server
const responseType = {
  JOINSESSION: "JOINSESSION",
  NEXTQUESTION: "NEXTQUESTION",
  ENDSESSION: "ENDSESSION",
  SENDRESULT: "SENDRESULT",
  QUESTIONEND: "QUESTIONEND",
};

//Layout type, user is either joining quiz with the form, waiting for teacher's action or answering a question
const LayoutType = {
  JoiningQuiz: "JoiningQuiz",
  WaitingForTeacher: "WaitingForTeacher",
  AnsweringQuestion: "AnsweringQuestion",
};

//stomp client used to connect with the server over web socket
let stompClient;

//User side of the web socket connection
const JoinQuiz = () => {
  //Holds the quiz of the session. It's question answers are displayed to the user with each currentQuestionKey change
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const quizRef = useRef<Quiz>();
  //Holds the info about current question in the session
  const [currentQuestionKey, setCurrentQuestionKey] = useState<number>(0);
  //Contains info about which answers are correct and which are false. This info is saved to each question.
  //Student makes the decision which answers he thinks are correct when he is answering the question
  const [currentAnswers, setCurrentAnswers] = useState<QuizAnswers | null>(
    initialQuizAnswers
  );

  const handleAnswerCorrectChange = (key: string) => {
    setCurrentAnswers((prevQuizAnswers) => {
      return {
        ...prevQuizAnswers,
        [key]: {
          value: prevQuizAnswers![key].value,
          isCorrect: !prevQuizAnswers![key].isCorrect,
        },
      } as QuizAnswers;
    });
  };

  //Contains current type of layout the page should have
  const [currentLayout, setCurrentLayout] = useState<string>(
    LayoutType.JoiningQuiz
  );
  //Result of the student in the quiz, gets displayed at the end of the quiz and is received from server
  const [result, setResult] = useState<number | null>(null);
  //Holds current session id the user is connected to
  const sessionId = useRef(0);
  //Displayed when user is waiting for teacher's action, can have multiple values
  let textWhenWaiting = useRef("undefined");

  //refs for handling join session form text fields
  const sessionIdTextField = useRef<HTMLInputElement>(null);
  const userNameTextField = useRef<HTMLInputElement>(null);

  //makes sure that user gets alerted when he leaves
  const alertUser = (e): void => {
    e.preventDefault();
    e.returnValue = "";
  };

  //subscribe to the user topic. When client is subscribed, it can send and receive messages to/from the server on the subscribed topic
  const onConnected = () => {
    stompClient.subscribe("/user/topic/session", onMessageReceived);
  };

  //handles receiving messages from the server
  //All received messages contain field responseType. Based on that is decided how to handle the message
  const onMessageReceived = (payload): void => {
    const payloadData = JSON.parse(payload.body);
    let warningMessage = "NONE";
    switch (payloadData.responseType) {
      //if user gets response to his request to join session
      case responseType.JOINSESSION:
        const joinSessionResponse: JoinSessionResponse = payloadData;
        switch (joinSessionResponse.responseStatus) {
          //User just connected to the quiz with the session id, setting states that came from server
          case responseStatus.CONNECTED:
            const quiz = joinSessionResponse.quiz;
            let questions = quiz.questions;
            const newQuestions = mergeSort(questions);
            quiz.questions = newQuestions;
            quizRef.current = quiz;
            setQuiz(quiz);
            setCurrentLayout(LayoutType.WaitingForTeacher);
            //also want to notify user from now on that he won't be able to join the session anymore
            window.addEventListener("beforeunload", alertUser);
            break;
          //User tried to connect to the session, but the name already exists in it
          case responseStatus.NAMEEXISTS:
            warningMessage = "This name is already on the screen :(";
            sessionId.current = 0;
            break;
          //The session id user typed is invalid
          case responseStatus.SESSIONNOTFOUND:
            warningMessage =
              "The session with id you typed was not found, check if it is the same as on your teacher's screen";
            sessionId.current = 0;
            break;
          default:
            break;
        }
        break;
      //if user gets message to swap to the next question
      case responseType.NEXTQUESTION:
        const nextQuestionMessage: nextQuestionMessage = payloadData;
        const nextKey = nextQuestionMessage.questionKey;
        setCurrentAnswers((prevAnswers) => {
          return {
            ...prevAnswers,
            topRightAnswer: {
              isCorrect: false,
              value:
                quizRef.current!.questions[nextKey - 1].topRightAnswer.value,
            },
            topLeftAnswer: {
              isCorrect: false,
              value:
                quizRef.current!.questions[nextKey - 1].topLeftAnswer.value,
            },
            bottomRightAnswer: {
              isCorrect: false,
              value:
                quizRef.current!.questions[nextKey - 1].bottomRightAnswer.value,
            },
            bottomLeftAnswer: {
              isCorrect: false,
              value:
                quizRef.current!.questions[nextKey - 1].bottomLeftAnswer.value,
            },
          } as QuizAnswers;
        });
        setCurrentQuestionKey(nextKey);
        setCurrentLayout(LayoutType.AnsweringQuestion);
        textWhenWaiting.current = "undefined";
        break;
      //the session just ended
      case responseType.ENDSESSION:
        //set states to inital values
        setCurrentLayout(LayoutType.JoiningQuiz);
        setCurrentQuestionKey(0);
        setQuiz(null);
        setResult(null);
        //reset event handler of the window
        window.removeEventListener("beforeunload", alertUser);
        break;
      //User gets their result at the end of the quiz
      case responseType.SENDRESULT:
        const result: resultMessage = payloadData;
        setResult(result.correctAnswers);
        break;
      //The question just ended, in case the user hasn't answered yet, he cannot anymore
      case responseType.QUESTIONEND:
        if (textWhenWaiting.current === "undefined")
          textWhenWaiting.current = "was not";
        setCurrentAnswers(initialQuizAnswers);
        setCurrentLayout(LayoutType.WaitingForTeacher);
        break;
      default:
        break;
    }
    //if warning message is other than none, display it in a notification
    if (warningMessage !== "NONE") {
      toast.warn(warningMessage, {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  //Log error in the web socket connection
  const onError = (err) => {
    console.log(err);
  };

  //on first render open connection with the server
  useEffect(() => {
    let Sock = new SockJS(SOCKET_URL);
    stompClient = over(Sock);
    stompClient.debug = null;
    stompClient.connect({}, onConnected, onError);
    //when user closes the page, delete the window event handlers
    return () => {
      //reset event handler of the window
      window.removeEventListener("beforeunload", alertUser);
    };
    // disable eslint because of onConnected, tried to wrap it in useCallback but didn't work
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Validates input from the user when he is joining session. If needed, user is notified with Toast notifications
  const validateInputs = (name: string, sessionId): string => {
    if (name === "" || sessionId === "") {
      return "Both fields should be filled";
    }
    if (name.length > 64) {
      return "This name is too long, please pick a shorter one";
    }
    if (isNaN(sessionId)) {
      return "Session id should be number";
    }
    if (sessionId.length > 5) {
      return "Session id should have exactly 5 numbers";
    }
    return "OK";
  };

  //handles user joinng the session. Checks the inputs and sends the request to join the session to server
  const handleJoinQuizButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    //dumb typescript checks
    let currName = "";
    let session = "";
    if (userNameTextField.current && sessionIdTextField.current) {
      currName = userNameTextField.current.value;
      session = sessionIdTextField.current.value;
    }
    const validateMessage = validateInputs(currName, session);
    if (validateMessage !== "OK") {
      toast.warn(validateMessage, {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    sessionId.current = parseInt(session);

    const joinRequest = {
      name: currName,
      sessionId: session,
    };
    stompClient.send("/ws/joinsession", {}, JSON.stringify(joinRequest));
  };

  //Sends the answer to the server, which handles it. Then switch the layout to waiting for teacher
  const handleSendAnswersButton = () => {
    const newQuestionAnswer: QuestionAnswer = {
      sessionId: sessionId.current,
      questionKey: currentQuestionKey,
      topLeftAnswer: currentAnswers!.topLeftAnswer.isCorrect,
      bottomLeftAnswer: currentAnswers!.bottomLeftAnswer.isCorrect,
      topRightAnswer: currentAnswers!.topRightAnswer.isCorrect,
      bottomRightAnswer: currentAnswers!.bottomRightAnswer.isCorrect,
    };
    stompClient.send("/ws/submitAnswer", {}, JSON.stringify(newQuestionAnswer));
    textWhenWaiting.current = "was";
    setCurrentAnswers(initialQuizAnswers);
    setCurrentLayout(LayoutType.WaitingForTeacher);
  };

  return (
    <>
      {/* Prompt which should be displayed to user when he leaves the page */}
      <Prompt
        when={LayoutType.JoiningQuiz !== currentLayout}
        message="If you leave now, you won't be able to join this session anymore"
      />
      {/* Notifications for user, for example when user tries to join the session which doesn't exist */}
      <ToastContainer
        position="top-center"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {currentLayout === LayoutType.JoiningQuiz && (
        <JoinForm
          sessionId={sessionIdTextField}
          userName={userNameTextField}
          handleJoinQuizButton={handleJoinQuizButton}
        />
      )}
      {currentLayout === LayoutType.WaitingForTeacher && (
        <Grid
          container
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{ height: "calc(100vh - 45px)" }}
        >
          <Grid item xs={2}>
            <Typography variant="h5">
              {currentQuestionKey === 0
                ? "You should see yourself on the screen!"
                : result !== null
                ? "You got " +
                  result +
                  "/" +
                  quiz?.questions.length +
                  " answers correct. Thanks for playing!"
                : "Your answer " + textWhenWaiting.current + " recorded"}
            </Typography>
          </Grid>
          <Typography variant="h5">
            {currentQuestionKey === 0
              ? "Wait for your teacher to start the quiz."
              : result !== null
              ? "You can now leave this page."
              : "Wait for your teacher to activate next question."}
          </Typography>
        </Grid>
      )}
      {currentLayout === LayoutType.AnsweringQuestion && (
        <AnswerToQuestion
          currentAnswers={currentAnswers}
          handleAnswerCorrectChange={handleAnswerCorrectChange}
          handleSendAnswersButton={handleSendAnswersButton}
        />
      )}
    </>
  );
};

export default JoinQuiz;
