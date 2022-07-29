package cz.cvut.fel.sem.service;

import cz.cvut.fel.sem.dto.user.UserDto;
import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    /**
     * Handles registration - saves the user to the database
     * @param user from the client
     * @return id of the newly created user
     */
    @Transactional
    public Long persist(User user) {
        Objects.requireNonNull(user);
        user.encodePassword(passwordEncoder);
        userRepository.save(user);
        return user.getId();
    }

    /**
     * Retrieves user from the database by their email
     * @param email email of the user
     * @return user with corresponding email
     */
    @Transactional
    public User getUserByEmail(String email) {
        Objects.requireNonNull(email);
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new NotFoundException("User with email" + email + " was not found");
        }
        return user;
    }

    /**
     * Retrieves user from the database by their id
     * @param id id of the user
     * @return user with corresponding id
     */
    @Transactional
    public User getUserById(Long id) {
        Objects.requireNonNull(id);
        Optional<User> optionalUser = userRepository.findById(id);
        if(!optionalUser.isPresent()){
            throw new NotFoundException("User with id" + id + " was not found");
        }
        return optionalUser.get();
    }

    /**
     * Verifies whether user with the email exists in the database
     * @param email email of the user
     * @return true if user exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean exists(String email) {
        return userRepository.findByEmail(email) != null;
    }

    /**
     * Private method to check whether password user typed at the login matches the saved encoded password
     * @param user User credentials user typed into the login form
     * @param userToCheck User credentials stored in the database
     * @return true if passwords matches, false otherwise
     */
    private boolean checkCredentials(User user, User userToCheck){
        return passwordEncoder.matches(user.getPassword(), userToCheck.getPassword());
    }

    /**
     * Checks if email and password user typed on the login page exist in the database together.
     * @param loginDataFromUser credentials user typed into the login form
     * @return If user typed correct credentials, the user email and id are returned to the user.
     * Otherwise empty UserDto is returned.
     */
    @Transactional
    public UserDto checkLoginUser(User loginDataFromUser){
        if(!exists(loginDataFromUser.getEmail())){
            return new UserDto(0L, "");
        }
        User userToCheck = getUserByEmail(loginDataFromUser.getEmail());
        if(checkCredentials(loginDataFromUser, userToCheck)){
            return new UserDto(userToCheck.getId(), userToCheck.getEmail());
        }
        return new UserDto(0L, "");
    }
}
