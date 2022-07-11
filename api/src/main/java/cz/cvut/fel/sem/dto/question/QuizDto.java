package cz.cvut.fel.sem.dto.question;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuizDto {
    private Long id;
    private String name;
    private List<QuestionDto> questions;
}
