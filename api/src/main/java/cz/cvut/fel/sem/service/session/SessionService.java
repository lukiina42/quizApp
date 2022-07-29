package cz.cvut.fel.sem.service.session;

import cz.cvut.fel.sem.dto.session.forStudent.*;
import cz.cvut.fel.sem.dto.session.forTeacher.*;
import cz.cvut.fel.sem.dto.session.fromStudent.AnswerToQuestionDto;
import cz.cvut.fel.sem.dto.session.fromStudent.JoinSessionRequestDto;
import cz.cvut.fel.sem.dto.session.fromTeacher.*;
import cz.cvut.fel.sem.exception.InvalidKeyException;
import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.mapper.QuizMapper;
import cz.cvut.fel.sem.model.quizQuestion.AnswerPosition;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import cz.cvut.fel.sem.model.session.QuestionInSession;
import cz.cvut.fel.sem.model.session.Session;
import cz.cvut.fel.sem.model.session.SessionStatus;
import cz.cvut.fel.sem.model.session.SessionUser;
import cz.cvut.fel.sem.repository.QuizRepository;
import cz.cvut.fel.sem.repository.session.SessionRepository;
import cz.cvut.fel.sem.repository.session.SessionUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Handles the session requests from teacher or student. Those involve:
 * Creating new session, joining session, ending session etc.
 */
@Service
public class SessionService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    private final SessionRepository sessionRepository;

    private final SessionUserRepository sessionUserRepository;

    private final QuizRepository quizRepository;

    private final QuizMapper quizMapper;

    @Autowired
    public SessionService(SimpMessagingTemplate template, SessionRepository sessionRepository, SessionUserRepository sessionUserRepository, QuizRepository quizRepository, QuizMapper quizMapper) {
        this.simpMessagingTemplate = template;
        this.sessionRepository = sessionRepository;
        this.sessionUserRepository = sessionUserRepository;
        this.quizRepository = quizRepository;
        this.quizMapper = quizMapper;
    }

    /**
     * Creates new session, initializes it with empty list of students, adds the teacherName
     * and id of the quiz, which is being tested in the session
     * @param  teacherName id of the teacher who creates the session
     * @param quizId id of the quiz in the session
     * @return the newly created session
     */
    public Session createSession(String teacherName, Long quizId){
        long generatedId = ThreadLocalRandom.current().nextLong(10000, 99999);
        while(sessionRepository.findById(generatedId).isPresent()){
            generatedId = ThreadLocalRandom.current().nextLong(10000, 99999);
        }
        Session newSession = new Session(
            generatedId,
            quizId,
            teacherName,
            0,
            SessionStatus.OPENEDFORCONNECTIONS,
            null,
            new ArrayList<>()
        );
        Quiz testedQuiz = quizRepository.getOne(quizId);
        List<QuestionInSession> newQuestionsInSessionList = new ArrayList<>();
        //Create empty questions in session with correct answers
        //Those will be used when user answers to the question, the correct values will be checked and
        //amounts of answers to the question will be updated
        for(Question question : testedQuiz.getQuestions()){
            QuestionInSession newQuestionInSession = new QuestionInSession(question.getKey(), newSession);
            question.getAnswers().forEach(answer -> {
                switch(answer.getAnswerPosition()){
                    case TOPLEFT:
                        newQuestionInSession.setTopLeftAnswerCorrect(answer.isCorrect());
                        break;
                    case TOPRIGHT:
                        newQuestionInSession.setTopRightAnswerCorrect(answer.isCorrect());
                        break;
                    case BOTTOMLEFT:
                        newQuestionInSession.setBottomLeftAnswerCorrect(answer.isCorrect());
                        break;
                    case BOTTOMRIGHT:
                        newQuestionInSession.setBottomRightAnswerCorrect(answer.isCorrect());
                        break;
                    default:
                        break;
                }
            });
            newQuestionsInSessionList.add(newQuestionInSession);
        }
        newSession.setQuestionsInSession(newQuestionsInSessionList);
        sessionRepository.save(newSession);
        return newSession;
    }

    public boolean sessionExists(Long sessionId){
        return sessionRepository.existsById(sessionId);
    }

    /**
     * Checks if the user is in the userList
     * @param  userList contains the list of the users in the session
     * @param username username of the user which wants to connect to the session
     * @return true if user is in the session, false otherwise
     */
    public boolean userWithUserNameExistsInSession(List<SessionUser> userList, String username){
        for(SessionUser sessionUser : userList){
            if(sessionUser.getName().equals(username)){
                return true;
            }
        }
        return false;
    }

    /**
     * Handles the request from student to join the session.
     * It fetches the session from the database and first of all checks whether the
     * user name is already in the session. Then it adds the user to the session and updates
     * the session in the database.
     * After adding user to the session, message with the name of the student is sent to the teacher,
     * teacher's client then displays the name of the new student.
     * @param  joinSessionRequestDto contains the session id and student's name
     * @return response with the quiz of the session, corresponding response status, which
     * signalises whether the request was successful and type
     * of the response message, which tells the client to what exactly is he getting a response
     */
    public JoinSessionResponseDto handleJoinQuizRequest(JoinSessionRequestDto joinSessionRequestDto, String userId){
        Session session = sessionRepository.findById(joinSessionRequestDto.getSessionId()).get();
        //the session is not opened for connections
        if(!session.getSessionStatus().equals(SessionStatus.OPENEDFORCONNECTIONS)){
            return new JoinSessionResponseDto(null, JoinSessionResponseEnum.NOTFOUND, StudentResponseType.JOINSESSION);
        }
        List<SessionUser> userList = session.getStudentsInQuiz();
        //the user with the same name already exists in the session
        if(userWithUserNameExistsInSession(userList, joinSessionRequestDto.getName())){
            return new JoinSessionResponseDto(null, JoinSessionResponseEnum.NAMEEXISTS, StudentResponseType.JOINSESSION);
        }
        userList.add(new SessionUser(userId, joinSessionRequestDto.getName(), 0, 0, session));
        session.setStudentsInQuiz(userList);
        sessionRepository.save(session);
        //send notification to teacher with the name of newly connected user
        simpMessagingTemplate.convertAndSendToUser(
            session.getTeacherId(),
            "/topic/session",
            new NewStudentInSessionDto(joinSessionRequestDto.getName(), MessageType.NEWSTUDENTINSESSION));
        return new JoinSessionResponseDto(
            quizMapper.mapToDto(quizRepository.getOne(session.getQuizId())),
            JoinSessionResponseEnum.CONNECTED,
            StudentResponseType.JOINSESSION
        );
    }

    /**
     * Handles the request from teacher to move to the next question in the quiz.
     * It fetches the session from the database and sends the message to all
     * users with the key of the new question, users' clients will then display the answers
     * from the question with the new key
     * @param  nextQuestionRequestDto contains the sessionId and the key of the next question
     */
    public void handleNextQuestionInSession(NextQuestionRequestDto nextQuestionRequestDto){
        Objects.requireNonNull(nextQuestionRequestDto);
        if(!sessionRepository.existsById(nextQuestionRequestDto.getSessionId())){
            throw new NotFoundException("The session with id " + nextQuestionRequestDto.getSessionId() + " was not found");
        }
        Session currentSession = sessionRepository.findById(nextQuestionRequestDto.getSessionId()).get();
        currentSession.setCurrentQuestionKey(nextQuestionRequestDto.getQuestionKey());
        if(nextQuestionRequestDto.getQuestionKey() == 1){
            currentSession.setSessionStatus(SessionStatus.ACTIVE);
        }
        sessionRepository.save(currentSession);
        currentSession.getStudentsInQuiz().parallelStream().forEach(student -> simpMessagingTemplate.convertAndSendToUser(
            student.getSessionUserIdentifier(),
            "/topic/session",
            new NextQuestionResponseDto(nextQuestionRequestDto.getQuestionKey(),  StudentResponseType.NEXTQUESTION)
        ));
    }

    /**
     * Handles the request from teacher to end the quiz.
     * It fetches the session from the database and sends the message to all
     * users with response type ENDSESSION. The users' client will then handle
     * the end of the quiz. After that the session is deleted from the database
     * @param endOfSessionRequestDto contains session id and the reason of end of the session
     */
    public void handleEndOfSession(EndSessionRequestDto endOfSessionRequestDto){
        Objects.requireNonNull(endOfSessionRequestDto);
        if(!sessionRepository.existsById(endOfSessionRequestDto.getSessionId())){
            return;
        }
        Session currentSession = sessionRepository.findById(endOfSessionRequestDto.getSessionId()).get();
        //send message to all of the users
        notifyUsersSessionEnd(currentSession);
        //delete the session if the reason is page leave
        if(endOfSessionRequestDto.getReason().equals(EndOfSessionReason.PAGELEAVE)) {
            sessionRepository.deleteById(endOfSessionRequestDto.getSessionId());
        //If the reason is end of the quiz, change status of session and save session
        }
        else if(endOfSessionRequestDto.getReason().equals(EndOfSessionReason.ENDOFQUIZ)){
            currentSession.setSessionStatus(SessionStatus.COMPLETED);
            sessionRepository.save(currentSession);
        }
    }

    /**
     * Notifies all the users - students in the session that the session just ended
     * @param session session being ended
     */
    private void notifyUsersSessionEnd(Session session){
        session.getStudentsInQuiz().parallelStream().forEach(student -> simpMessagingTemplate.convertAndSendToUser(
            student.getSessionUserIdentifier(),
            "/topic/session",
            new EndSessionResponseDto(StudentResponseType.ENDSESSION)
        ));
    }

    /**
     * Firstly, the method tries to find the user in the current sessions.
     * If disconnected user is teacher, it deletes whole session and sends notification to students.
     * If disconnected user is student, it deletes him from the session and session goes on.
     * @param userId session user id of the user who just got disconnected
     */
    public void handleSocketDisconnect(String userId){
        List<Session> allSessions = sessionRepository.findAll();
        for(Session session : allSessions) {
            //the disconnected user is the teacher
            if (session.getTeacherId().equals(userId)) {
                notifyUsersSessionEnd(session);
                sessionRepository.deleteById(session.getId());
                return;
            }
            for(SessionUser student : session.getStudentsInQuiz()){
                if (student.getSessionUserIdentifier().equals(userId)) {
                    //remove the student from the session and delete him from the database
                    List<SessionUser> usersInSession = session.getStudentsInQuiz();
                    usersInSession.remove(student);
                    session.setStudentsInQuiz(usersInSession);
                    sessionRepository.save(session);
                    sessionUserRepository.deleteById(student.getId());
                    return;
                }
            }
        }
    }

    /**
     * Private method used to find current tested question in the quiz. It is a functionality which was used
     * on multiple places so it was extracted.
     * Usage: teacher requests an evaluation of current question, so first of all server must find current question,
     * where all the details are stored
     * @param questionsInSession List of questions in the session
     * @param key key of the question, which is to be returned
     * @return The question with the correct key from the list
     */
    private QuestionInSession findQuestionInSessionByKey(List<QuestionInSession> questionsInSession, int key){
        for(QuestionInSession questionInSession : questionsInSession){
            if(questionInSession.getQuestionKey() == key){
                return questionInSession;
            }
        }
        throw new NotFoundException("The question with key " + key + " was not found");
    }

    /**
     * Private method used to find user in the session based on his id. It is a functionality which was used
     * on multiple places so it was extracted.
     * @param session Session where the user should be
     * @param userId id of the user. Users' ids in the session are compared to this parameter
     * @return User with userId
     */
    private SessionUser findUserInSession(Session session, String userId){
        for(SessionUser sessionUser : session.getStudentsInQuiz()){
            if(sessionUser.getSessionUserIdentifier().equals(userId)){
                return sessionUser;
            }
        }
        throw new NotFoundException("The user with id " + userId + " was not found in session " + session.getId());
    }

    /**
     * Private method used to determine whether student's answer is correct or not.
     * @param answerToQuestionDto student's answer
     * @param questionInSession tested question, where correct answers are stored
     * @return true if all of the answers are correct, false otherwise
     */
    private boolean isAnswerCorrect(AnswerToQuestionDto answerToQuestionDto, QuestionInSession questionInSession){
        return answerToQuestionDto.isTopLeftAnswer() == questionInSession.isTopLeftAnswerCorrect() &&
                answerToQuestionDto.isTopRightAnswer() == questionInSession.isTopRightAnswerCorrect() &&
                answerToQuestionDto.isBottomLeftAnswer() == questionInSession.isBottomLeftAnswerCorrect() &&
                answerToQuestionDto.isBottomRightAnswer() == questionInSession.isBottomRightAnswerCorrect();
    }

    /**
     * Handles student's answer to the question.
     * All of the student's answers (whether wrong or correct) are recorded in current tested question. In the question,
     * we can then clearly see, how many student's answered, how many of them answered correctly and how many times was
     * each answer marked as correct by the students.
     * After updating the question, the student's score is also updated - specifically his amount of answered questions
     * and amount of correctly answered questions.
     * After updating the question and student, it is checked whether all students answered to the question. If so,
     * message to the teacher is sent and teacher then displays question evaluation on his screen
     * @param answerToQuestionDto student's answer to the question
     * @param userId student's identifier used to find him in the database
     */
    public void handleStudentSubmitsAnswer(AnswerToQuestionDto answerToQuestionDto, String userId){
        Objects.requireNonNull(answerToQuestionDto);
        if(!sessionRepository.existsById(answerToQuestionDto.getSessionId())) {
            throw new NotFoundException("The session with id " + answerToQuestionDto.getSessionId() + " was not found");
        }
        Session currentSession = sessionRepository.findById(answerToQuestionDto.getSessionId()).get();
        //check if current key of the session and current key from the teacher match
        if(answerToQuestionDto.getQuestionKey() != currentSession.getCurrentQuestionKey()){
            throw new InvalidKeyException("The keys don't match!");
        }
        //Find user which sent the request in the session to update his score
        SessionUser currentUser = findUserInSession(currentSession, userId);

        List<SessionUser> studentsInQuiz = currentSession.getStudentsInQuiz();
        List<QuestionInSession> questionsInSession = currentSession.getQuestionsInSession();
        QuestionInSession currentTestedQuestion = findQuestionInSessionByKey(questionsInSession, answerToQuestionDto.getQuestionKey());
        //remove current question from questions in session as it will be updated
        questionsInSession.remove(currentTestedQuestion);
        //remove current student from students list as it will be updated
        studentsInQuiz.remove(currentUser);
        Map<String, Integer> currentQuestionAmountOfAnswers =  currentTestedQuestion.getAmountsOfPositiveAnswersToEachAnswer();
        if(answerToQuestionDto.isTopLeftAnswer()){
            currentQuestionAmountOfAnswers.put(AnswerPosition.TOPLEFT.toString(), currentQuestionAmountOfAnswers.get(AnswerPosition.TOPLEFT.toString()) + 1);
        }
        if(answerToQuestionDto.isTopRightAnswer()){
            currentQuestionAmountOfAnswers.put(AnswerPosition.TOPRIGHT.toString(), currentQuestionAmountOfAnswers.get(AnswerPosition.TOPRIGHT.toString()) + 1);
        }
        if(answerToQuestionDto.isBottomLeftAnswer()){
            currentQuestionAmountOfAnswers.put(AnswerPosition.BOTTOMLEFT.toString(), currentQuestionAmountOfAnswers.get(AnswerPosition.BOTTOMLEFT.toString()) + 1);
        }
        if(answerToQuestionDto.isBottomRightAnswer()){
            currentQuestionAmountOfAnswers.put(AnswerPosition.BOTTOMRIGHT.toString(), currentQuestionAmountOfAnswers.get(AnswerPosition.BOTTOMRIGHT.toString()) + 1);
        }
        if(isAnswerCorrect(answerToQuestionDto, currentTestedQuestion)){
            currentTestedQuestion.setAmountOfCorrectAnswers(currentTestedQuestion.getAmountOfCorrectAnswers() + 1);
            currentUser.setAmountOfCorrectAnswers(currentUser.getAmountOfCorrectAnswers() + 1);
        }
        currentTestedQuestion.setAmountOfAnswersTotal(currentTestedQuestion.getAmountOfAnswersTotal() + 1);
        currentUser.setAmountOfAnsweredQuestions(currentUser.getAmountOfAnsweredQuestions() + 1);
        //add updated question back to the questions in session
        questionsInSession.add(currentTestedQuestion);
        //add updated student to the students list
        studentsInQuiz.add(currentUser);
        //set udpated questions and students in session
        currentSession.setQuestionsInSession(questionsInSession);
        currentSession.setStudentsInQuiz(studentsInQuiz);
        sessionRepository.save(currentSession);
        //check if the answer is the last one
        if(currentTestedQuestion.getAmountOfAnswersTotal() == currentSession.getStudentsInQuiz().size()){
            //send message to the teacher that all students answered to the question
            simpMessagingTemplate.convertAndSendToUser(
                currentSession.getTeacherId(),
                "/topic/session",
                new QuestionEvaluationDto(
                    currentTestedQuestion.getAmountOfAnswersTotal(),
                    currentTestedQuestion.getAmountOfCorrectAnswers(),
                    currentTestedQuestion.getQuestionKey(),
                    currentTestedQuestion.getAmountsOfPositiveAnswersToEachAnswer(),
                    MessageType.QUESTIONEVALUATION
                )
            );
        }else{
            //else send teacher information that another student answered the question
            simpMessagingTemplate.convertAndSendToUser(
                    currentSession.getTeacherId(),
                    "/topic/session",
                    new StudentAnsweredDto(
                            currentTestedQuestion.getAmountOfAnswersTotal(),
                            currentSession.getStudentsInQuiz().size(),
                            MessageType.STUDENTANSWERED
                    )
            );
        }
    }

    /**
     * This is requested by the teacher at the end of the session when all of the questions were tested and answered.
     * The results of the students are obtained by iterating through all of the students and storing their scores and
     * names in the map. This map is then sent to the teacher who can display it on their computer
     * @param sessionId id of the session
     * @return Student results in a map
     */
    public StudentResultsResponseDto getStudentResultsInSession(Long sessionId){
        if(!sessionRepository.existsById(sessionId)) {
            throw new NotFoundException("The session with id " + sessionId + " was not found");
        }
        Session currentSession = sessionRepository.findById(sessionId).get();
        Map<String, Integer> studentResults = new HashMap<>();
        for(SessionUser sessionUser : currentSession.getStudentsInQuiz()){
            studentResults.put(sessionUser.getName(), sessionUser.getAmountOfCorrectAnswers());
        }
        return new StudentResultsResponseDto(studentResults, MessageType.STUDENTRESULTS);
    }

    /**
     * At the end of the quiz, teacher only displays top 3 students in the quiz in order for worse student not to feel
     * ashamed of themselves. So in order to let the students know their score, it is sent to each of them and displyed
     * on their own device and not to anyone else.
     * @param sessionId id of the session where we want to send results to the students
     */
    public void sendResultsToStudents(Long sessionId){
        if(!sessionRepository.existsById(sessionId)) {
            throw new NotFoundException("The session with id " + sessionId + " was not found");
        }
        Session currentSession = sessionRepository.findById(sessionId).get();
        currentSession.getStudentsInQuiz().parallelStream().forEach(student -> simpMessagingTemplate.convertAndSendToUser(
            student.getSessionUserIdentifier(),
            "/topic/session",
            new UserResultDto(student.getAmountOfCorrectAnswers(), StudentResponseType.SENDRESULT)
        ));
    }

    /**
     * This method is triggered when teacher requests evaluation of the question.
     * The current tested question is fetched from the database - it contains all the info about question evaluation -
     * and sent to the teacher from WSSessionController
     * @param evaluationRequestDto contains sessionId to find session in the database and key of the question about which
     * the teacher wants evaluation
     * @return the evaluation of the question
     */
    public QuestionEvaluationDto sendEvaluationToTeacher(EvaluationRequestDto evaluationRequestDto){
        if(!sessionRepository.existsById(evaluationRequestDto.getSessionId())) {
            throw new NotFoundException("The session with id " + evaluationRequestDto.getSessionId() + " was not found");
        }
        Session currentSession = sessionRepository.findById(evaluationRequestDto.getSessionId()).get();
        if(evaluationRequestDto.getQuestionKey() != currentSession.getCurrentQuestionKey()){
            throw new InvalidKeyException("The keys don't match!");
        }
        List<QuestionInSession> questionsInSession = currentSession.getQuestionsInSession();
        QuestionInSession currentTestedQuestion = findQuestionInSessionByKey(questionsInSession, evaluationRequestDto.getQuestionKey());
        currentSession.getStudentsInQuiz().parallelStream().forEach(student -> simpMessagingTemplate.convertAndSendToUser(
                student.getSessionUserIdentifier(),
                "/topic/session",
                new QuestionEndDto(StudentResponseType.QUESTIONEND)
        ));
        return new QuestionEvaluationDto(
            currentTestedQuestion.getAmountOfAnswersTotal(),
            currentTestedQuestion.getAmountOfCorrectAnswers(),
            currentTestedQuestion.getQuestionKey(),
            currentTestedQuestion.getAmountsOfPositiveAnswersToEachAnswer(),
            MessageType.QUESTIONEVALUATION
        );
    }
}
