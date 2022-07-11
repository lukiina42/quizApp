package cz.cvut.fel.sem.model.quizQuestion;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.sem.model.AbstractEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "answer")
public class Answer extends AbstractEntity {
    private String value;
    private boolean isCorrect;
    @Enumerated(EnumType.STRING)
    private AnswerPosition answerPosition;
    @ManyToOne
    @JsonIgnore
    private Question question;
}
