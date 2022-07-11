package cz.cvut.fel.sem.dto.question;

import cz.cvut.fel.sem.model.quizQuestion.LanguageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionTextDto {
    private String value;
    private String language;
}
