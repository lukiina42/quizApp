package cz.cvut.fel.sem.dto.session.forStudent;

import cz.cvut.fel.sem.dto.session.forStudent.StudentResponseType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EndSessionResponseDto {
    private StudentResponseType responseType;
}
