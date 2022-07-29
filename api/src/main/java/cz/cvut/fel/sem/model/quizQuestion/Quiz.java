package cz.cvut.fel.sem.model.quizQuestion;

import cz.cvut.fel.sem.model.AbstractEntity;
import cz.cvut.fel.sem.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Quiz extends AbstractEntity {
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<Question> questions;
    private String name;

    @ManyToOne
    private User owner;
}
