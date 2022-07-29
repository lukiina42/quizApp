package cz.cvut.fel.sem.dto.session.forTeacher;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NewStudentInSessionDto {
    String name;

    private MessageType messageType;
}
