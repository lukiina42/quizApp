package cz.cvut.fel.sem.dto.session.fromTeacher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRequestDto {
    private Long sessionId;
    private int questionKey;
}
