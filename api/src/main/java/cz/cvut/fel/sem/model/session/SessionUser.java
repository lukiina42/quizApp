package cz.cvut.fel.sem.model.session;

import cz.cvut.fel.sem.model.AbstractEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SessionUser extends AbstractEntity {
    private String sessionUserIdentifier;

    private String name;

    @Setter
    private int amountOfAnsweredQuestions;
    @Setter
    private int amountOfCorrectAnswers;

    @ManyToOne
    private Session session;
}
