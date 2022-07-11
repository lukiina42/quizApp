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

@RestController
@RequestMapping("/quiz")
public class QuizController {
    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @CrossOrigin
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createQuiz(@RequestBody QuizDto quizDto) {
        quizService.saveQuiz(quizDto);
        final HttpHeaders headers = RestUtils.createLocationHeaderFromCurrentUri("/{id}", 1);
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Quiz getQuiz(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }

    @CrossOrigin
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<QuizDto> getAll() {
        return quizService.getAllQuizzes();
    }
}
