package cz.cvut.fel.sem.repository;

import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    public List<Quiz> findAllByOwner(User user);
}
