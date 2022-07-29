package cz.cvut.fel.sem.dto.session.fromStudent;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * When student answers to the question in session, client sends his choices in this format
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerToQuestionDto {
    private Long sessionId;
    private int questionKey;
    private boolean topLeftAnswer;
    private boolean topRightAnswer;
    private boolean bottomLeftAnswer;
    private boolean bottomRightAnswer;
}
