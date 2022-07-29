package cz.cvut.fel.sem.dto.session.forStudent;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResultDto {
    private int correctAnswers;
    private StudentResponseType responseType;
}
