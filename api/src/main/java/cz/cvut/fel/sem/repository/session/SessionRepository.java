package cz.cvut.fel.sem.repository.session;

import cz.cvut.fel.sem.model.session.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
