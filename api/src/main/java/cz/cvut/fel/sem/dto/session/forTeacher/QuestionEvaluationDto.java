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
}
