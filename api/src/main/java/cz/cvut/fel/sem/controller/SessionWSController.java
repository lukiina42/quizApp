package cz.cvut.fel.sem.controller;

import cz.cvut.fel.sem.dto.session.forStudent.JoinSessionResponseDto;
import cz.cvut.fel.sem.dto.session.forStudent.JoinSessionResponseEnum;
import cz.cvut.fel.sem.dto.session.forStudent.StudentResponseType;
import cz.cvut.fel.sem.dto.session.forTeacher.CreateSessionResponseDto;
import cz.cvut.fel.sem.dto.session.forTeacher.MessageType;
import cz.cvut.fel.sem.dto.session.forTeacher.QuestionEvaluationDto;
import cz.cvut.fel.sem.dto.session.forTeacher.StudentResultsResponseDto;
import cz.cvut.fel.sem.dto.session.fromStudent.AnswerToQuestionDto;
import cz.cvut.fel.sem.dto.session.fromStudent.AnswerToQuestionPayloadDto;
import cz.cvut.fel.sem.dto.session.fromStudent.JoinSessionRequestDto;
import cz.cvut.fel.sem.dto.session.fromTeacher.*;
import cz.cvut.fel.sem.model.session.Session;
import cz.cvut.fel.sem.service.session.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Objects;

/**
 * Controller for handling the connection between server and client
 * Annotation MessageMapping at each method describes the request endpoint
 * Annotation SendToUser is used, if server wants to immediately answer to the client
 * Methods with annotation SendToUser always return a value, which is sent to the client
 * All methods use SessionService, which handles the requests. Because of that, methods are
 * described with JavaDoc there.
 * @see cz.cvut.fel.sem.service.UserService
 */
@Controller
public class SessionWSController {
    final SessionService sessionService;

    @Autowired
    public SessionWSController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @MessageMapping("/createsession")
    @SendToUser("/topic/session")
    private CreateSessionResponseDto createSession(CreateSessionDto createSessionDto, Principal principal){
        Session newSession = sessionService.createSession(principal.getName(), createSessionDto.getQuizId());
        return new CreateSessionResponseDto(newSession.getId(), MessageType.CREATESESSIONRESPONSE);
    }

    @MessageMapping("/joinsession")
    @SendToUser("/topic/session")
    private JoinSessionResponseDto joinSession(JoinSessionRequestDto joinSessionRequestDto, Principal principal){
        if(!sessionService.sessionExists(joinSessionRequestDto.getSessionId())){
            return new JoinSessionResponseDto(null, JoinSessionResponseEnum.NOTFOUND, StudentResponseType.JOINSESSION);
        }
        return sessionService.handleJoinQuizRequest(joinSessionRequestDto, principal.getName());
    }

    @MessageMapping("/nextQuestion")
    private void nextQuestionInSession(NextQuestionRequestDto nextQuestionRequestDto){
        sessionService.handleNextQuestionInSession(nextQuestionRequestDto);
    }

    @MessageMapping("/endSession")
    private void endSession(EndSessionRequestDto endSessionRequestDto){
        sessionService.handleEndOfSession(endSessionRequestDto);
    }

    @MessageMapping("/submitAnswer")
    private void studentSubmitsAnswer(AnswerToQuestionPayloadDto answerToQuestionPayloadDto, Principal principal){
        sessionService.handleStudentSubmitsAnswer(answerToQuestionPayloadDto, principal.getName());
    }

    @MessageMapping("/getStudentResults")
    @SendToUser("/topic/session")
    private StudentResultsResponseDto getStudentsResults(StudentResultsRequestDto studentResultsRequestDto){
        return sessionService.getStudentResultsInSession(studentResultsRequestDto.getSessionId());
    }


    @MessageMapping("/sendResults")
    private void sendResultHandler(StudentResultsRequestDto studentResultsRequestDto){
        sessionService.sendResultsToStudents(studentResultsRequestDto.getSessionId());
    }

    @MessageMapping("/getEvaluation")
    @SendToUser("/topic/session")
    private QuestionEvaluationDto getEvaluation(EvaluationRequestDto evaluationRequestDto){
        Objects.requireNonNull(evaluationRequestDto);
        return sessionService.sendEvaluationToTeacher(evaluationRequestDto);
    }
}
