package cz.cvut.fel.sem.dto.question;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDto {
    private String position;
    private String value;
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    private int key;
}
