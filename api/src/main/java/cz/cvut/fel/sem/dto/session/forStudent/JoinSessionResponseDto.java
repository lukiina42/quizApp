package cz.cvut.fel.sem.dto.session.forStudent;

import cz.cvut.fel.sem.dto.question.QuizDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class JoinSessionResponseDto {
    private QuizDto quiz;

    private JoinSessionResponseEnum responseStatus;

    private StudentResponseType responseType;
}
