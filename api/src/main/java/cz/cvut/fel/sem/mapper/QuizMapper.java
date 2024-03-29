package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Maps objects in model structure to DTO (data transfer object) structure and vice versa
 */
@Component
public class QuizMapper {
    private final QuestionMapper questionMapper;

    @Autowired
    public QuizMapper(QuestionMapper questionMapper) {
        this.questionMapper = questionMapper;
    }

    public Quiz mapToModel(QuizDto quizDto){
        Quiz newQuiz = new Quiz();
        newQuiz.setQuestions(questionMapper.mapListToModel(quizDto.getQuestions(), newQuiz));
        newQuiz.setName(quizDto.getName());
        newQuiz.setId(quizDto.getId());
        newQuiz.setDescription(quizDto.getDescription());
        return newQuiz;
    }

    public QuizDto mapToDto(Quiz quiz){
        return new QuizDto(quiz.getId(), quiz.getName(), quiz.getDescription(), questionMapper.mapListToDto(quiz.getQuestions()));
    }
}
