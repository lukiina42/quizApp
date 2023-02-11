package cz.cvut.fel.sem.dto.question;

import com.fasterxml.jackson.annotation.JsonProperty;
import cz.cvut.fel.sem.model.quizQuestion.Answer;
import cz.cvut.fel.sem.model.quizQuestion.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDto {
    private int key;
    private QuestionType questionType;
    private String name;
    @JsonProperty("question")
    private QuestionTextDto questionText;
    private AnswerDto topLeftAnswer;
    private AnswerDto topRightAnswer;
    private AnswerDto bottomLeftAnswer;
    private AnswerDto bottomRightAnswer;
}
