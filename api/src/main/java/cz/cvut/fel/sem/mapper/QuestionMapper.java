package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.AnswerDto;
import cz.cvut.fel.sem.dto.question.QuestionDto;
import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.model.quizQuestion.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Maps objects in model structure to DTO (data transfer object) structure and vice versa
 */
@Component
public class QuestionMapper {
    private final QuestionTextMapper questionTextMapper;
    private final AnswerMapper answerMapper;

    @Autowired
    public QuestionMapper(QuestionTextMapper questionTextMapper, AnswerMapper answerMapper) {
        this.questionTextMapper = questionTextMapper;
        this.answerMapper = answerMapper;
    }

    public Question mapOneQuestionToModel(QuestionDto questionDto, Quiz quiz){
        Question question = new Question(
                questionDto.getKey(),
                questionDto.getQuestionType(),
                questionDto.getName(),
                questionDto.isCorrect(),
                null,
                null,
                quiz
        );
        question.setQuestionText(questionTextMapper.mapToModel(questionDto.getQuestionText(), question));
        List<Answer> answerList = new ArrayList<>();
        if(questionDto.getQuestionType() == QuestionType.QUIZ) {
            for (AnswerDto answerDto : questionDto.getAnswers()) {
                answerList.add(answerMapper.mapToModel(answerDto, question));
            }
        }
        question.setAnswers(answerList);
        return question;
    }

    public List<Question> mapListToModel(List<QuestionDto> questionDtos, Quiz quiz){
        List<Question> questions = new ArrayList<>();
        for(QuestionDto questionDto : questionDtos){
            questions.add(mapOneQuestionToModel(questionDto, quiz));
        }
        return questions;
    }

    public QuestionDto mapOneQuestionToDto(Question question){
        List<AnswerDto> answers = new ArrayList<>();
        for(Answer answer : question.getAnswers()){
            answers.add(answerMapper.mapToDto(answer));
        }
        return new QuestionDto(
            question.getKey(),
            question.getQuestionType(),
            question.getName(),
            questionTextMapper.mapToDto(question.getQuestionText()),
            question.isCorrect(),
            answers
        );
    }

    public List<QuestionDto> mapListToDto(List<Question> questions){
        List<QuestionDto> questionDtos = new ArrayList<>();
        questions.forEach((question -> questionDtos.add(mapOneQuestionToDto(question))));
        return questionDtos;
    }
}
