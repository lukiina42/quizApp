package cz.cvut.fel.sem.service;

import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void persist(User user) {
        Objects.requireNonNull(user);
        user.encodePassword(passwordEncoder);
        userRepository.save(user);
    }

    @Transactional
    public User getUserByEmail(String email) {
        Objects.requireNonNull(email);
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new NotFoundException("User with email" + email + " was not found");
        }
        return user;
    }

    @Transactional
    public User getUserById(Long id) {
        Objects.requireNonNull(id);
        Optional<User> optionalUser = userRepository.findById(id);
        if(!optionalUser.isPresent()){
            throw new NotFoundException("User with id" + id + " was not found");
        }
        return optionalUser.get();
    }

    @Transactional(readOnly = true)
    public boolean exists(String email) {
        return userRepository.findByEmail(email) != null;
    }
}
