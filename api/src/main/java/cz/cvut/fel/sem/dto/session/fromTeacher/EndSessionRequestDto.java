package cz.cvut.fel.sem.dto.session.fromTeacher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EndSessionRequestDto {
    private Long sessionId;
    private EndOfSessionReason reason;
}
