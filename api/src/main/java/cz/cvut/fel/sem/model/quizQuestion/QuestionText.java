package cz.cvut.fel.sem.model.quizQuestion;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.sem.model.AbstractEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "questiontext")
public class QuestionText extends AbstractEntity {
    private String value;
    @Enumerated(EnumType.STRING)
    private LanguageType languageType;
    @OneToOne
    @JsonIgnore
    private Question question;
}
