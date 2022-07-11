package cz.cvut.fel.sem.repository;


import cz.cvut.fel.sem.model.quizQuestion.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
