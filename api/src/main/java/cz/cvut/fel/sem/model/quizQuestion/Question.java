package cz.cvut.fel.sem.model.quizQuestion;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.sem.model.AbstractEntity;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "question")
public class Question extends AbstractEntity {
    private int key;
    @Enumerated(EnumType.STRING)
    private QuestionType questionType;
    private String name;
    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL)
    private QuestionText questionText;
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Answer> answers;
    @ManyToOne
    @JsonIgnore
    private Quiz quiz;
}
