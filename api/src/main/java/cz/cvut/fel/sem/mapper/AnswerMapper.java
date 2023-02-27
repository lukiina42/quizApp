package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.AnswerDto;
import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.model.quizQuestion.Answer;
import cz.cvut.fel.sem.model.quizQuestion.AnswerPosition;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Maps objects in model structure to DTO (data transfer object) structure and vice versa
 */
@Component
public class AnswerMapper {

    private AnswerPosition getAnswerPosition(AnswerDto answerDto){
        switch(answerDto.getPosition()){
            case "topRightAnswer":
                return AnswerPosition.TOPRIGHT;
            case "topLeftAnswer":
                return AnswerPosition.TOPLEFT;
            case "bottomRightAnswer":
                return AnswerPosition.BOTTOMRIGHT;
            case "bottomLeftAnswer":
                return AnswerPosition.BOTTOMLEFT;
            default:
                throw new NotFoundException("Answer position " + answerDto.getPosition() + " not found.");
        }
    }

    public Answer mapToModel(AnswerDto answerDto, Question question){
        return new Answer(answerDto.getValue(),answerDto.getKey(), answerDto.isCorrect(), getAnswerPosition(answerDto), question);
    }

    private String getStringPosition(Answer answer){
        switch(answer.getAnswerPosition()){
            case TOPRIGHT:
                return "topRightAnswer";
            case TOPLEFT:
                return "topLeftAnswer";
            case BOTTOMRIGHT:
                return "bottomRightAnswer";
            case BOTTOMLEFT:
                return "bottomLeftAnswer";
            default:
                throw new NotFoundException("Answer position " + answer.getAnswerPosition() + " not found.");
        }
    }

    public AnswerDto mapToDto(Answer answer){
        return new AnswerDto(getStringPosition(answer), answer.getValue(), answer.isCorrect(), answer.getKey());
    }

    /**
     * Finds answer in the list based on its position in the quiz
     * @param answerList list of the answers
     * @param answerPosition position of seeked answer
     * @return the found answer. If the answer doesn't exist, return null
     */
    public AnswerDto getSpecificAnswerDtoFromList(List<Answer> answerList, AnswerPosition answerPosition){
        Answer answerToMap = null;
        for(Answer answer : answerList){
            if(answer.getAnswerPosition().equals(answerPosition)){
                answerToMap = answer;
            }
        }
        answerToMap = answerToMap == null ? new Answer("", 0, false, answerPosition, null) : answerToMap;
        return mapToDto(answerToMap);
    }
}
