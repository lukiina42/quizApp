package cz.cvut.fel.sem.service;

import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.mapper.QuizMapper;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import cz.cvut.fel.sem.repository.QuestionRepository;
import cz.cvut.fel.sem.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuizMapper quizMapper;
    private final QuestionRepository questionRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, QuizMapper quizMapper, QuestionRepository questionRepository) {
        this.quizRepository = quizRepository;
        this.quizMapper = quizMapper;
        this.questionRepository = questionRepository;
    }

    @Transactional
    public void saveQuiz(QuizDto quizDto) {
        Objects.requireNonNull(quizDto);
        //If the quiz is being updated, delete its questions first to prevent database duplicating
        if(quizDto.getId() != null){
            Quiz originalQuiz = quizRepository.getOne(quizDto.getId());
            for(Question question : originalQuiz.getQuestions()){
                questionRepository.delete(question);
            }
        }
        Quiz quizToSave = quizMapper.mapToModel(quizDto);
        quizRepository.save(quizToSave);
    }

    @Transactional
    public Quiz getQuizById(Long id){
        Quiz foundQuiz = quizRepository.getOne(id);
        if(foundQuiz == null){
            throw new NotFoundException("Quiz with id " + id + "was not found");
        }
        return foundQuiz;
    }

    @Transactional
    public List<QuizDto> getAllQuizzes(){
        List<Quiz> quizzes = quizRepository.findAll();
        List<QuizDto> quizDtos = new ArrayList<>();
        for(Quiz quiz : quizzes){
            quizDtos.add(quizMapper.mapToDto(quiz));
        }
        return quizDtos;
    }
}
