package cz.cvut.fel.sem.dto.session.forTeacher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class QuestionEvaluationDto {
    private int amountOfAnswersTotal;
    private int amountOfCorrectAnswers;
    private int questionKey;
    private Map<String, Integer> amountsOfPositiveAnswersToEachAnswer;
    private MessageType messageType;

    //is used when the evaluation is of the true false question
    public QuestionEvaluationDto(int amountOfAnswersTotal, int amountOfCorrectAnswers, int questionKey, MessageType messageType) {
        this.amountOfAnswersTotal = amountOfAnswersTotal;
        this.amountOfCorrectAnswers = amountOfCorrectAnswers;
        this.questionKey = questionKey;
        this.messageType = messageType;
    }
}
