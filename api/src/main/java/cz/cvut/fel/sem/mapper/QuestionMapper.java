package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.AnswerDto;
import cz.cvut.fel.sem.dto.question.QuestionDto;
import cz.cvut.fel.sem.model.quizQuestion.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

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
                null,
                null,
                quiz
        );
        question.setQuestionText(questionTextMapper.mapToModel(questionDto.getQuestionText(), question));
        List<Answer> answerList = new ArrayList<>();
        answerList.add(answerMapper.mapToModel(questionDto.getTopRightAnswer(), AnswerPosition.TOPRIGHT, question));
        answerList.add(answerMapper.mapToModel(questionDto.getTopLeftAnswer(), AnswerPosition.TOPLEFT, question));
        answerList.add( answerMapper.mapToModel(questionDto.getBottomRightAnswer(), AnswerPosition.BOTTOMRIGHT, question));
        answerList.add(answerMapper.mapToModel(questionDto.getBottomLeftAnswer(), AnswerPosition.BOTTOMLEFT, question));
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
        AnswerDto topRightAnswer = answerMapper.getSpecificAnswerDtoFromList(question.getAnswers(), AnswerPosition.TOPRIGHT);
        AnswerDto topLeftAnswer = answerMapper.getSpecificAnswerDtoFromList(question.getAnswers(), AnswerPosition.TOPLEFT);
        AnswerDto bottomRightAnswer = answerMapper.getSpecificAnswerDtoFromList(question.getAnswers(), AnswerPosition.BOTTOMRIGHT);
        AnswerDto bottomLeftAnswer = answerMapper.getSpecificAnswerDtoFromList(question.getAnswers(), AnswerPosition.BOTTOMLEFT);
        return new QuestionDto(
            question.getKey(),
            question.getQuestionType(),
            question.getName(),
            questionTextMapper.mapToDto(question.getQuestionText()),
            topLeftAnswer,
            topRightAnswer,
            bottomLeftAnswer,
            bottomRightAnswer
        );
    }

    public List<QuestionDto> mapListToDto(List<Question> questions){
        List<QuestionDto> questionDtos = new ArrayList<>();
        questions.forEach((question -> questionDtos.add(mapOneQuestionToDto(question))));
        return questionDtos;
    }
}
