package cz.cvut.fel.sem.dto.session.forTeacher;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

@Getter
@AllArgsConstructor
public class StudentResultsResponseDto {
    private Map<String, Integer> studentScores;
    private MessageType messageType;
}
