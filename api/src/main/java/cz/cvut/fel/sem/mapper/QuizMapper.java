package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
        return newQuiz;
    }

    public QuizDto mapToDto(Quiz quiz){
        return new QuizDto(quiz.getId(), quiz.getName(), questionMapper.mapListToDto(quiz.getQuestions()));
    }
}
