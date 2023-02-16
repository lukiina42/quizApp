import React, { useEffect, useMemo, useRef } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useState } from "react";
import SOCKET_URL from "../../../common/components";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import { Prompt } from "react-router";
import { useHistory } from "react-router-dom";
import { Quiz, Question } from "../../../common/types";
import QuestionDisplay from "./questionDisplay/QuestionDisplay";
import QuestionEvaluation from "./questionEvaluation/QuestionEvaluation";
import StudentResults from "./studentResults/StudentResults";
import { HashLoader } from "react-spinners";
import {
  CreateSessionMessageRequest,
  CreateSessionMessageResponse,
  EndSessionReason,
  EndSessionRequest,
  LayoutType,
  MessageType,
  NewStudentMessageResponse,
  NextMessageRequest,
  QuestionEvaluationType,
  SessionEvaluationRequest,
  StudentAnsweredResponse,
  StudentResultsResponse,
  StudentScoresType,
} from "./types";

//finds the question with current key
const getTheQuestionByKey = (quiz: Quiz, key: number): Question | null => {
  for (let question in quiz.questions) {
    if (quiz.questions[question].key === key) {
      return quiz.questions[question];
    }
  }
  return null;
};

//stomp client used to connect with the server over web socket
let stompClient;

//This component handle teacher's view when he starts a quiz
// I have had a lot of troubles with stale props in onMessageReceived callback here.
// The solution is to create refs of the variables I need in their current state in the callback
const StartQuiz = (props) => {
  const quiz: Quiz = props.location.state.quiz;

  //history used to move user to different page. Used at the end of the quiz to move teacher to the home page
  const history = useHistory();

  //id of the session which is currently opened
  const [sessionId, setSessionId] = useState<number>(0);
  //ref of session id, used before teacher closes the page to send request to the server to stop the session
  const sessionIdRef = useRef<number>(0);
  //Users connected to the session, displayed on the screen at the start of the quiz
  const [users, setUsers] = useState<string[]>([]);
  //key of the current question in the quiz
  const [currentQuizKey, setCurrentQuizKey] = useState<number>(0);
  //layout which should be displayed, for example starting page with the users and session id / the question with all the values / student's results..
  const [currentLayout, setCurrentLayout] = useState<string>(
    LayoutType.UsersJoining
  );
  //The evaluation of the current tested question. It has info
  //about how many times the student's marked each answer as true and how many student's were right
  const [currentQuestionEvaluation, setCurrentQuestionEvaluation] =
    useState<QuestionEvaluationType | null>(null);
  //Student scores, comes from server at the end of the quiz, only top 3 are displayed
  const [studentScores, setStudentScores] = useState<StudentScoresType | null>(
    null
  );
  //Holds info about how many students answered to current tested question out of how many
  const [studentsAnsweredInfo, setStudentsAnsweredInfo] = useState<
    StudentAnsweredResponse | undefined
  >(undefined);

  const amountOfStudents = useRef(0);
  //In current implementation when user closes the page, the function which sends the request to end the session is called.
  //This is unnecessary at the end of the quiz, this state helps to determine whether the request should be called or not
  const quizAlreadyEnded = useRef(false);
  //derived states
  //current question found by its key in the quiz
  const currentQuestion = useMemo(
    () => getTheQuestionByKey(quiz, currentQuizKey),
    [currentQuizKey, quiz]
  );
  //boolean telling whether current question is the last one
  const lastQuestion = currentQuizKey === quiz.questions.length;

  //when teacher opens connection with the server, create new session
  const onConnected = () => {
    stompClient.subscribe("/user/topic/session", onMessageReceived);
    //request to create of new session with the started quiz id
    const quizIdToSend: CreateSessionMessageRequest = {
      quizId: quiz.id as number,
    };
    stompClient.send("/ws/createsession", {}, JSON.stringify(quizIdToSend));
  };

  const requestStudentResults = () => {
    const getStudentResultsRequest: SessionEvaluationRequest = {
      sessionId: sessionIdRef.current,
    };
    stompClient.send(
      "/ws/getStudentResults",
      {},
      JSON.stringify(getStudentResultsRequest)
    );
  };

  const handleQuestionEvaluation = (
    questionEvaluation: QuestionEvaluationType
  ) => {
    if (questionEvaluation.questionKey === quiz.questions.length) {
      requestStudentResults();
    }
    setCurrentQuestionEvaluation(questionEvaluation);
    setCurrentLayout(LayoutType.ShowEvaluation);
    setStudentsAnsweredInfo((prevState) => {
      //BEWARE, PREV STATE IS ACTUALLY THE INITIAL STATE HERE BECAUSE OF THE CALLBACK SNAPSHOT
      return {
        ...prevState,
        amountOfAnswers: 0,
      } as StudentAnsweredResponse;
    });
  };

  const handleCreateSessionResponse = (
    createSessionResponse: CreateSessionMessageResponse
  ) => {
    setSessionId(createSessionResponse.sessionId);
    sessionIdRef.current = createSessionResponse.sessionId;
  };

  const handleNewStudentInSession = (
    newStudentInSession: NewStudentMessageResponse
  ) => {
    amountOfStudents.current = amountOfStudents.current + 1;
    setUsers((currUsers) => {
      return [...currUsers, newStudentInSession.name];
    });
  };

  const handleStudentResultsResponse = (
    studentResults: StudentResultsResponse
  ) => {
    setStudentScores(studentResults.studentScores);
  };

  const handleStudentsAnsweredResponse = (
    studentsAnsweredInfo: StudentAnsweredResponse
  ) => {
    setStudentsAnsweredInfo(studentsAnsweredInfo);
    amountOfStudents.current = studentsAnsweredInfo.amountOfStudents;
  };

  //First it is decided which type of message was received with property messageType. Then the message is properly handled
  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.messageType) {
      //Response to create new session request, the session id is in the response
      case MessageType.CreateSessionResponse:
        handleCreateSessionResponse(
          payloadData as CreateSessionMessageResponse
        );
        break;
      //The message from the server with the new user that connected to the session
      case MessageType.NewStudentInSession:
        handleNewStudentInSession(payloadData as NewStudentMessageResponse);
        break;
      //The server returns the evaluation of the current question
      case MessageType.QuestionEvaluation:
        handleQuestionEvaluation(payloadData as QuestionEvaluationType);
        break;
      //The server returns results of the students in the quiz
      case MessageType.StudentResults:
        handleStudentResultsResponse(payloadData as StudentResultsResponse);
        break;
      case MessageType.StudentAnswered:
        handleStudentsAnsweredResponse(payloadData as StudentAnsweredResponse);
        break;
    }
  };

  //Log error in the web socket connection
  const onError = (err): void => {
    console.log(err);
  };

  //sends the request to server to end the current session
  //is currently not used but may be useful in the future - for example "end session" button might be added
  const sendRequestToEndTheQuiz = (
    reasonParameter: string,
    lastSessionId?: number
  ): void => {
    if (quizAlreadyEnded.current) {
      return;
    }
    const endSessionRequest: EndSessionRequest = {
      sessionId: lastSessionId ? lastSessionId : sessionIdRef.current,
      reason: reasonParameter,
    };
    stompClient.send("/ws/endSession", {}, JSON.stringify(endSessionRequest));
  };

  //makes sure that user gets alerted when he leaves
  const alertUser = (e): void => {
    e.preventDefault();
    e.returnValue = "";
  };

  //open the connection with the server on the first render
  useEffect(() => {
    //opens the websocket connection with server
    let Sock = new SockJS(SOCKET_URL);
    stompClient = over(Sock);
    stompClient.debug = null;
    stompClient.connect({}, onConnected, onError);
    //Event listener for handling the case when user wants to leave the page but the session is opened.
    //It asks the user if he is sure he wants to end the current session
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      sendRequestToEndTheQuiz(EndSessionReason.PAGELEAVE);
      stompClient.disconnect();
    };
    // disable eslint because of onConnected, tried to wrap it in useCallback but didn't work
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Moves the quiz session to the next question.
  //Handles the button displayed on the question evaluation page and on the start page before the quiz starts
  const handleNextQuestionButton = () => {
    //end of the quiz
    if (lastQuestion) {
      sendRequestToEndTheQuiz(EndSessionReason.ENDOFQUIZ);
      quizAlreadyEnded.current = true;
      history.push("/");
      return;
    }
    const nextMessageRequest: NextMessageRequest = {
      sessionId: sessionId,
      questionKey: currentQuizKey + 1,
    };
    stompClient.send(
      "/ws/nextQuestion",
      {},
      JSON.stringify(nextMessageRequest)
    );
    setCurrentQuizKey((currentQuizKey) => currentQuizKey + 1);
    setCurrentLayout(LayoutType.DisplayQuestion);
  };

  //send request to get the evaluation of the current question with the current submitted answers
  const handleEndQuestionButton = () => {
    const getEvaluationRequest = {
      sessionId: sessionId,
      questionKey: currentQuestion?.key,
    };
    stompClient.send(
      "/ws/getEvaluation",
      {},
      JSON.stringify(getEvaluationRequest)
    );
  };

  //Switches layout to display students' results
  const handleShowStudentResults = () => {
    const getEvaluationRequest: SessionEvaluationRequest = {
      sessionId: sessionId,
    };
    stompClient.send(
      "/ws/sendResults",
      {},
      JSON.stringify(getEvaluationRequest)
    );
    setCurrentLayout(LayoutType.StudentScores);
  };

  return (
    <>
      <Prompt
        when={
          !(
            lastQuestion &&
            (LayoutType.ShowEvaluation === currentLayout ||
              LayoutType.StudentScores === currentLayout)
          )
        }
        message="If you leave now, the whole session will end. Are you sure you want to do this?"
      />
      {currentLayout === LayoutType.UsersJoining && (
        <Grid
          container
          direction={"column"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          sx={{ height: "100vh", width: "100%" }}
        >
          <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ fontSize: "40px", fontWeight: "bold" }}>{quiz.name}</Box>
          </Grid>
          <Grid item xs={1}>
            <Box sx={{ fontSize: "20px", display: "flex" }}>
              {sessionId !== 0 ? (
                <>
                  <Typography>Session id for students:</Typography>
                  <Typography fontWeight={"bold"}>{sessionId}</Typography>
                </>
              ) : (
                <HashLoader loading={true} size={50} color={"#7D93FF"} />
              )}
            </Box>
          </Grid>
          <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
            <Typography fontWeight={"bold"} fontSize={"20"}>
              The users currently connected to the quiz:
            </Typography>
          </Grid>
          <Grid item xs sx={{ width: "90%" }}>
            <Grid container justifyContent={"center"} sx={{ width: "100%" }}>
              {users.map((user) => (
                <Grid item key={user}>
                  <ListItemButton
                    onMouseEnter={(event) =>
                      (event.currentTarget.style.cursor = "default")
                    }
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={user} />
                  </ListItemButton>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={2}>
            {users.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestionButton}
              >
                Start the quiz
              </Button>
            )}
          </Grid>
        </Grid>
      )}
      {currentLayout === LayoutType.DisplayQuestion && (
        <Grid
          container
          alignItems={"center"}
          direction="column"
          justifyContent={"flex-start"}
          sx={{ height: "100vh", minHeight: "680px", width: "100%" }}
        >
          <Grid item xs={11} sx={{ width: "100%", minHeight: "630px" }}>
            <Grid
              container
              direction={"column"}
              alignItems="center"
              justifyContent={"center"}
              sx={{ width: "100%", height: "100%" }}
            >
              <Grid item xs={11} sx={{ width: "100%" }}>
                <QuestionDisplay
                  questionName={currentQuestion?.name}
                  codeTextProp={currentQuestion?.question.value}
                  quizAnswers={{
                    topLeftAnswer: {
                      value: currentQuestion
                        ? currentQuestion.topLeftAnswer.value
                        : "",
                      isCorrect: false,
                    },
                    topRightAnswer: {
                      value: currentQuestion
                        ? currentQuestion.topRightAnswer.value
                        : "",
                      isCorrect: false,
                    },
                    bottomLeftAnswer: {
                      value: currentQuestion
                        ? currentQuestion.bottomLeftAnswer.value
                        : "",
                      isCorrect: false,
                    },
                    bottomRightAnswer: {
                      value: currentQuestion
                        ? currentQuestion.bottomRightAnswer.value
                        : "",
                      isCorrect: false,
                    },
                  }}
                  languageProp={currentQuestion?.question.language}
                />
              </Grid>
              <Grid item xs={1}>
                <Typography fontWeight={"bold"} fontSize={"20px"}>
                  Amount of students who answered / total students :&nbsp;
                  {studentsAnsweredInfo
                    ? studentsAnsweredInfo.amountOfAnswers
                    : 0}{" "}
                  /&nbsp;
                  {amountOfStudents.current}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs
            sx={{ minHeight: "50px", width: "100%", textAlign: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleEndQuestionButton}
            >
              End the question
            </Button>
          </Grid>
        </Grid>
      )}
      {currentLayout === LayoutType.ShowEvaluation && (
        <QuestionEvaluation
          handleNextQuestionButton={handleNextQuestionButton}
          questionEvaluation={currentQuestionEvaluation}
          currentQuestion={currentQuestion}
          lastQuestion={lastQuestion}
          handleShowStudentResults={handleShowStudentResults}
        />
      )}
      {currentLayout === LayoutType.StudentScores && (
        <StudentResults
          studentScores={studentScores}
          handleNextQuestionButton={handleNextQuestionButton}
        />
      )}
    </>
  );
};

export default StartQuiz;
