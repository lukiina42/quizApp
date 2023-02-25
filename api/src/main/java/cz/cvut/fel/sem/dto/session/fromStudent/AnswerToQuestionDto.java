package cz.cvut.fel.sem.dto.session.fromStudent;

import com.fasterxml.jackson.annotation.JsonProperty;
import cz.cvut.fel.sem.model.quizQuestion.AnswerPosition;
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

    private AnswerPosition position;
    @JsonProperty("isCorrect")
    private boolean isCorrect;
}
