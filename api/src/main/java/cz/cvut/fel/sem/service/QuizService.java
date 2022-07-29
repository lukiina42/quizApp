package cz.cvut.fel.sem.service;

import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.mapper.QuizMapper;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import cz.cvut.fel.sem.repository.QuestionRepository;
import cz.cvut.fel.sem.repository.QuizRepository;
import cz.cvut.fel.sem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuizMapper quizMapper;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    public QuizService(QuizRepository quizRepository, QuizMapper quizMapper, QuestionRepository questionRepository, UserRepository userRepository, UserService userService) {
        this.quizRepository = quizRepository;
        this.quizMapper = quizMapper;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /**
     * Saves the quiz created by the user into database.
     * First it looks up the user in the database, assigns the quiz to him, maps the quiz to model state
     * and then saves the quiz into database.
     * @param quizDto quiz created by the user in DTO state
     * @param userId id of the user who creates the quiz
     */
    @Transactional
    public void saveQuiz(QuizDto quizDto, Long userId) {
        Objects.requireNonNull(quizDto);
        Objects.requireNonNull(userId);
        User owner = userService.getUserById(userId);
        //If the quiz is being updated, delete its questions first to prevent database duplicating
        if(quizDto.getId() != null){
            Quiz originalQuiz = quizRepository.getOne(quizDto.getId());
            for(Question question : originalQuiz.getQuestions()){
                questionRepository.delete(question);
            }
        }
        Quiz quizToSave = quizMapper.mapToModel(quizDto);
        quizToSave.setOwner(owner);
        quizRepository.save(quizToSave);
    }

    /**
     * Looks up quiz by id in the database
     * @param id id of the quiz
     * @return quiz with the specified id
     */
    @Transactional
    public Quiz getQuizById(Long id){
        Quiz foundQuiz = quizRepository.getOne(id);
        if(foundQuiz == null){
            throw new NotFoundException("Quiz with id " + id + "was not found");
        }
        return foundQuiz;
    }

    /**
     * Deletes the quiz with specified id from the database
     * @param id of the quiz to be deleted
     */
    @Transactional
    public void deleteQuizById(Long id){
        Quiz foundQuiz = getQuizById(id);
        quizRepository.delete(foundQuiz);
    }

    /**
     * Deletes the quiz with specified id from the database
     * @param id of the quiz to be deleted
     */
    @Transactional
    public List<QuizDto> getAllQuizzesOfUser(Long id){
        User owner = userService.getUserById(id);
        List<Quiz> quizzes = quizRepository.findAllByOwner(owner);
        List<QuizDto> quizDtos = new ArrayList<>();

        for(Quiz quiz : quizzes){
            quizDtos.add(quizMapper.mapToDto(quiz));
        }
        return quizDtos;
    }
}
