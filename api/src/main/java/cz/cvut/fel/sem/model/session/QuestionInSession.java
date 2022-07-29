package cz.cvut.fel.sem.model.session;

import cz.cvut.fel.sem.model.AbstractEntity;
import cz.cvut.fel.sem.model.quizQuestion.AnswerPosition;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class QuestionInSession extends AbstractEntity {
    private boolean topLeftAnswerCorrect = false;
    private boolean topRightAnswerCorrect = false;
    private boolean bottomLeftAnswerCorrect = false;
    private boolean bottomRightAnswerCorrect = false;

    private int questionKey;

    private int amountOfAnswersTotal;
    private int amountOfCorrectAnswers;

    @ElementCollection
    @MapKeyColumn(name="answerName")
    @Column(name="amountOfAnswers")
    private Map<String, Integer> amountsOfPositiveAnswersToEachAnswer;

    @ManyToOne
    private Session session;

    public QuestionInSession(int questionKey, Session session) {
        this.questionKey = questionKey;
        this.session = session;
        amountsOfPositiveAnswersToEachAnswer = new HashMap<>();
        amountsOfPositiveAnswersToEachAnswer.put(AnswerPosition.TOPLEFT.toString(), 0);
        amountsOfPositiveAnswersToEachAnswer.put(AnswerPosition.TOPRIGHT.toString(), 0);
        amountsOfPositiveAnswersToEachAnswer.put(AnswerPosition.BOTTOMLEFT.toString(), 0);
        amountsOfPositiveAnswersToEachAnswer.put(AnswerPosition.BOTTOMRIGHT.toString(), 0);
    }
}
