package cz.cvut.fel.sem.repository.session;

import cz.cvut.fel.sem.model.session.SessionUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionUserRepository extends JpaRepository<SessionUser, Long> {
}
