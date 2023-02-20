package cz.cvut.fel.sem.service.session;

import cz.cvut.fel.sem.dto.session.forStudent.JoinSessionResponseDto;
import cz.cvut.fel.sem.dto.session.forStudent.JoinSessionResponseEnum;
import cz.cvut.fel.sem.dto.session.forStudent.StudentResponseType;
import cz.cvut.fel.sem.dto.session.forTeacher.MessageType;
import cz.cvut.fel.sem.dto.session.forTeacher.QuestionEvaluationDto;
import cz.cvut.fel.sem.dto.session.forTeacher.StudentResultsResponseDto;
import cz.cvut.fel.sem.dto.session.fromStudent.JoinSessionRequestDto;
import cz.cvut.fel.sem.dto.session.fromTeacher.EvaluationRequestDto;
import cz.cvut.fel.sem.mapper.QuizMapper;
import cz.cvut.fel.sem.model.quizQuestion.*;
import cz.cvut.fel.sem.model.session.QuestionInSession;
import cz.cvut.fel.sem.model.session.Session;
import cz.cvut.fel.sem.model.session.SessionStatus;
import cz.cvut.fel.sem.model.session.SessionUser;
import cz.cvut.fel.sem.repository.QuizRepository;
import cz.cvut.fel.sem.repository.session.SessionRepository;
import cz.cvut.fel.sem.repository.session.SessionUserRepository;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class SessionServiceTest {
    @Mock
    private SimpMessagingTemplate simpMessagingTemplate;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private SessionUserRepository sessionUserRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizMapper quizMapper;

    @InjectMocks
    SessionService sut;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @AfterEach
    public void afterEach() throws Exception {
        verifyNoMoreInteractions(simpMessagingTemplate);
        verifyNoMoreInteractions(sessionRepository);
        verifyNoMoreInteractions(sessionUserRepository);
        verifyNoMoreInteractions(quizMapper);
        verifyNoMoreInteractions(quizRepository);
    }

    @Test
    public void createSession_validArgumentsProvided_SessionCreated(){
        //Arrange
        String teacherName = "teacherName";
        Long quizId = 1L;
        List<Answer> answers1 = List.of(
                new Answer("answer1", false, AnswerPosition.TOPRIGHT, null),
                new Answer("answer2", true, AnswerPosition.TOPLEFT, null),
                new Answer("answer1", false, AnswerPosition.BOTTOMLEFT, null),
                new Answer("answer1", true, AnswerPosition.BOTTOMRIGHT, null)
        );
        Question question1 = new Question(1, QuestionType.QUIZ, "question1", null, answers1, null);
        Quiz quiz = new Quiz(List.of(question1), "Quiz", "quizDescription", null);
        when(quizRepository.getOne(quizId)).thenReturn(quiz);
        when(sessionRepository.save(any())).thenReturn(null);

        //Act
        Session actualResult = sut.createSession(teacherName, quizId);

        //Verify
        assertEquals(quizId, actualResult.getQuizId());
        assertEquals(teacherName, actualResult.getTeacherId());
        assertEquals(1, actualResult.getQuestionsInSession().size());
        assertFalse(actualResult.getQuestionsInSession().get(0).isBottomLeftAnswerCorrect());
        assertTrue(actualResult.getQuestionsInSession().get(0).isBottomRightAnswerCorrect());
        assertTrue(actualResult.getQuestionsInSession().get(0).isTopLeftAnswerCorrect());
        assertFalse(actualResult.getQuestionsInSession().get(0).isTopRightAnswerCorrect());
    }

    @Test
    public void sessionExist_sessionExists_sessionIsReturned(){
        //Arrange
        when(sessionRepository.existsById(1L)).thenReturn(true);

        //Act
        boolean actualResult = sut.sessionExists(1L);

        assertTrue(actualResult);
    }

    @Test
    public void userWithUserNameExistsInSession_userIsInTheSession_returnTrue(){
        //Arrange
        String usernameOfUser = "user";
        SessionUser sessionUser = mock(SessionUser.class);
        when(sessionUser.getName()).thenReturn(usernameOfUser);
        List<SessionUser> userList = List.of(sessionUser);

        //Act
        boolean actualResult = sut.userWithUserNameExistsInSession(userList, usernameOfUser);

        //Verify
        assertTrue(actualResult);
    }

    @Test
    public void userWithUserNameExistsInSession_userIsNotInTheSession_returnFalse(){
        //Arrange
        String usernameOfUser = "user";
        SessionUser sessionUser = mock(SessionUser.class);
        when(sessionUser.getName()).thenReturn(usernameOfUser);
        List<SessionUser> userList = List.of(sessionUser);

        //Act
        boolean actualResult = sut.userWithUserNameExistsInSession(userList, "unknownUser");

        //Verify
        assertFalse(actualResult);
    }

    @Test
    public void handleJoinQuizRequest_requestIsValid_responseSuccessCreated(){
        //Arrange
        String userId = "newUser";
        JoinSessionRequestDto joinSessionRequestDto= new JoinSessionRequestDto("newUserName", 1L);

        Session session = mock(Session.class);
        SessionUser sessionUser1 = mock(SessionUser.class);
        SessionUser sessionUser2 = mock(SessionUser.class);
        List<SessionUser> usersList = new ArrayList<>();
        usersList.add(sessionUser1);
        usersList.add(sessionUser2);
        when(sessionUser1.getName()).thenReturn("user1");
        when(sessionUser2.getName()).thenReturn("user2");
        when(session.getSessionStatus()).thenReturn(SessionStatus.OPENEDFORCONNECTIONS);
        when(session.getStudentsInQuiz()).thenReturn(usersList);
        when(sessionRepository.save(session)).thenReturn(null);
        when(session.getTeacherId()).thenReturn("teacherId");
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        //Act
        JoinSessionResponseDto actualResult = sut.handleJoinQuizRequest(joinSessionRequestDto, userId);

        //Arrange
        assertEquals(JoinSessionResponseEnum.CONNECTED, actualResult.getResponseStatus());
        assertEquals(StudentResponseType.JOINSESSION, actualResult.getResponseType());
    }

    @Test
    public void handleJoinQuizRequest_usernameExistsInSession_nameExistsResponseReturned(){
        //Arrange
        String userId = "newUser";
        JoinSessionRequestDto joinSessionRequestDto= new JoinSessionRequestDto("existingUser", 1L);

        Session session = mock(Session.class);
        SessionUser sessionUser1 = mock(SessionUser.class);
        SessionUser sessionUser2 = mock(SessionUser.class);
        List<SessionUser> usersList = new ArrayList<>();
        usersList.add(sessionUser1);
        usersList.add(sessionUser2);
        when(sessionUser1.getName()).thenReturn("existingUser");
        when(session.getSessionStatus()).thenReturn(SessionStatus.OPENEDFORCONNECTIONS);
        when(session.getStudentsInQuiz()).thenReturn(usersList);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        //Act
        JoinSessionResponseDto actualResult = sut.handleJoinQuizRequest(joinSessionRequestDto, userId);

        //Arrange
        assertEquals(JoinSessionResponseEnum.NAMEEXISTS, actualResult.getResponseStatus());
        assertEquals(StudentResponseType.JOINSESSION, actualResult.getResponseType());
    }

    @Test
    public void getStudentsResultsInSession_validIdSessionProvided_studentResultsReturned(){
        //Arrange
        Long sessionId = 1L;
        when(sessionRepository.existsById(sessionId)).thenReturn(true);
        Session session = mock(Session.class);
        SessionUser sessionUser1 = mock(SessionUser.class);
        SessionUser sessionUser2 = mock(SessionUser.class);
        List<SessionUser> usersList = new ArrayList<>();
        usersList.add(sessionUser1);
        usersList.add(sessionUser2);
        when(sessionUser1.getName()).thenReturn("user1");
        when(sessionUser1.getAmountOfCorrectAnswers()).thenReturn(1);
        when(sessionUser2.getName()).thenReturn("user2");
        when(sessionUser2.getAmountOfCorrectAnswers()).thenReturn(2);
        when(session.getStudentsInQuiz()).thenReturn(usersList);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        //Act
        StudentResultsResponseDto actualResult = sut.getStudentResultsInSession(sessionId);

        //Verify
        assertEquals(MessageType.STUDENTRESULTS, actualResult.getMessageType());
        assertEquals(Optional.of(1), Optional.of(actualResult.getStudentScores().get("user1")));
        assertEquals(Optional.of(2), Optional.of(actualResult.getStudentScores().get("user2")));
    }

    @Test
    public void sendEvaluationToTeacher_validRequest_returnEvaluation(){
        //Arrange
        EvaluationRequestDto evaluationRequestDto = new EvaluationRequestDto(1L, 2);

        when(sessionRepository.existsById(evaluationRequestDto.getSessionId())).thenReturn(true);
        Session session = mock(Session.class);
        SessionUser sessionUser1 = mock(SessionUser.class);
        SessionUser sessionUser2 = mock(SessionUser.class);
        Map<String, Integer> positiveAnswersToEachAnswer = Map.of(
                AnswerPosition.TOPLEFT.toString(), 1,
                AnswerPosition.TOPRIGHT.toString(), 2,
                AnswerPosition.BOTTOMLEFT.toString(), 3,
                AnswerPosition.BOTTOMRIGHT.toString(), 4
        );
        QuestionInSession questionInSession = mock(QuestionInSession.class);
        when(questionInSession.getAmountsOfPositiveAnswersToEachAnswer()).thenReturn(positiveAnswersToEachAnswer);
        when(questionInSession.getAmountOfAnswersTotal()).thenReturn(6);
        when(questionInSession.getQuestionKey()).thenReturn(2);
        when(questionInSession.getAmountOfCorrectAnswers()).thenReturn(5);
        List<SessionUser> usersList = new ArrayList<>();
        usersList.add(sessionUser1);
        usersList.add(sessionUser2);
        when(sessionUser1.getSessionUserIdentifier()).thenReturn("user1");
        when(sessionUser2.getSessionUserIdentifier()).thenReturn("user2");
        when(session.getStudentsInQuiz()).thenReturn(usersList);
        when(session.getCurrentQuestionKey()).thenReturn(2);
        when(session.getQuestionsInSession()).thenReturn(List.of(questionInSession));
        when(sessionRepository.findById(evaluationRequestDto.getSessionId())).thenReturn(Optional.of(session));

        //Act
        QuestionEvaluationDto actualResult = sut.sendEvaluationToTeacher(evaluationRequestDto);

        //Verify
        assertEquals(6, actualResult.getAmountOfAnswersTotal());
        assertEquals(5, actualResult.getAmountOfCorrectAnswers());
        assertEquals(Optional.of(1),
                Optional.of(actualResult.getAmountsOfPositiveAnswersToEachAnswer().get(AnswerPosition.TOPLEFT.toString())));
        assertEquals(Optional.of(2),
                Optional.of(actualResult.getAmountsOfPositiveAnswersToEachAnswer().get(AnswerPosition.TOPRIGHT.toString())));
        assertEquals(Optional.of(3),
                Optional.of(actualResult.getAmountsOfPositiveAnswersToEachAnswer().get(AnswerPosition.BOTTOMLEFT.toString())));
        assertEquals(Optional.of(4),
                Optional.of(actualResult.getAmountsOfPositiveAnswersToEachAnswer().get(AnswerPosition.BOTTOMRIGHT.toString())));
        assertEquals(2, actualResult.getQuestionKey());
    }
}
