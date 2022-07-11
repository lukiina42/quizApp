package cz.cvut.fel.sem.model.quizQuestion;

import cz.cvut.fel.sem.model.AbstractEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Quiz extends AbstractEntity {
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.PERSIST)
    private List<Question> questions;
    private String name;

    //implementing with user will be done later
    //@ManyToOne
    //private User owner;
}
