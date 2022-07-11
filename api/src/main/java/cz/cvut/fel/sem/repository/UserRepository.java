package cz.cvut.fel.sem.repository;

import cz.cvut.fel.sem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    public User findByEmail(String email);
}
