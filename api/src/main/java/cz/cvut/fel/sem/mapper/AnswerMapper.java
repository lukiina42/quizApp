package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.AnswerDto;
import cz.cvut.fel.sem.model.quizQuestion.Answer;
import cz.cvut.fel.sem.model.quizQuestion.AnswerPosition;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AnswerMapper {
    public Answer mapToModel(AnswerDto answerDto, AnswerPosition answerPosition, Question question){
        return new Answer(answerDto.getValue(), answerDto.isCorrect(), answerPosition, question);
    }

    public AnswerDto mapToDto(Answer answer){
        return new AnswerDto(answer.getValue(), answer.isCorrect());
    }

    public AnswerDto getSpecificAnswerDtoFromList(List<Answer> answerList, AnswerPosition answerPosition){
        Answer answerToMap = null;
        for(Answer answer : answerList){
            if(answer.getAnswerPosition().equals(answerPosition)){
                answerToMap = answer;
            }
        }
        answerToMap = answerToMap == null ? new Answer("", false, answerPosition, null) : answerToMap;
        return mapToDto(answerToMap);
    }
}
