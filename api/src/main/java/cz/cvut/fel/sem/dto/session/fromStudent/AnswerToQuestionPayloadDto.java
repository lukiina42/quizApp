package cz.cvut.fel.sem.dto.session.fromStudent;

import cz.cvut.fel.sem.model.quizQuestion.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


/**
 * When student answers to the question in session, client sends his choices in this format
 */
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerToQuestionPayloadDto {
    private Long sessionId;
    private int questionKey;
    private QuestionType questionType;
    //in case the question is true false type, answer as a boolean is returned
    private boolean answer;
    private List<AnswerToQuestionDto> answers;
}
