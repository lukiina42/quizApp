package cz.cvut.fel.sem.model.session;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
@Setter
public class Session {
    @Id
    private Long id;

    private Long quizId;

    private String teacherId;

    private int currentQuestionKey;

    @Enumerated(EnumType.STRING)
    private SessionStatus sessionStatus;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<QuestionInSession> questionsInSession;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<SessionUser> studentsInQuiz;
}
