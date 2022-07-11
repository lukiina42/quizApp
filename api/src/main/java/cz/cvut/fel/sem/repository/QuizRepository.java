package cz.cvut.fel.sem.repository;

import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

}
