package cz.cvut.fel.sem.controller;

import cz.cvut.fel.sem.controller.util.RestUtils;
import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import cz.cvut.fel.sem.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Rest controller handling quiz requests
 * Utilizes QuizService for all of the requests. QuizService contains all the necessary logic
 * to handle the requests.
 */
@RestController
@RequestMapping("/quiz")
public class QuizController {
    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    /**
     * Handles creating and updating quiz.
     * @param userId id of the user who wants to create the quiz
     * @param quizDto the quiz to save
     * @return Response entity with headers and http status created
     */
    @CrossOrigin
    @PostMapping(value = "/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createQuiz(@PathVariable Long userId, @RequestBody QuizDto quizDto) {
        quizService.saveQuiz(quizDto, userId);
        final HttpHeaders headers = RestUtils.createLocationHeaderFromCurrentUri("/{id}", 1);
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    /**
     * @param id id of the quiz user wants to delete
     */
    @CrossOrigin
    @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuiz(@PathVariable Long id){
        quizService.deleteQuizById(id);
    }

    /**
     * @param userId id of the user whose quizzes are being fetched
     * @return All quizzes of the user in the database
     */
    @CrossOrigin
    @GetMapping(value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<QuizDto> getAll(@PathVariable Long userId) {
        return quizService.getAllQuizzesOfUser(userId);
    }
}
