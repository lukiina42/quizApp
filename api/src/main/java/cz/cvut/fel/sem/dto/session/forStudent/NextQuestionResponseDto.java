package cz.cvut.fel.sem.dto.session.forStudent;

import cz.cvut.fel.sem.dto.session.forStudent.StudentResponseType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Getter
public class NextQuestionResponseDto {
    private int questionKey;
    private StudentResponseType responseType;
}
