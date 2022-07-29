package cz.cvut.fel.sem.dto.session.fromTeacher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class NextQuestionRequestDto {
    private Long sessionId;
    private int questionKey;
}
