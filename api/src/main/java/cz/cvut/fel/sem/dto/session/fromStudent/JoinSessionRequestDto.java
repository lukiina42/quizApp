package cz.cvut.fel.sem.dto.session.fromStudent;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class JoinSessionRequestDto {
    private String name;

    private Long sessionId;
}
