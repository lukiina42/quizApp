package cz.cvut.fel.sem.dto.session.forTeacher;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentAnsweredDto {
    public int amountOfAnswers;
    public int amountOfStudents;
    public MessageType messageType;
}
