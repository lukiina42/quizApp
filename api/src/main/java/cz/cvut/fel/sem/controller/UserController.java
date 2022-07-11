package cz.cvut.fel.sem.controller;

import cz.cvut.fel.sem.controller.util.RestUtils;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @CrossOrigin
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createUser(@RequestBody User user) {
        userService.persist(user);
        final HttpHeaders headers = RestUtils.createLocationHeaderFromCurrentUri("/{id}", user.getId());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping(value = "/{email:.+}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Boolean getUserByEmail(@PathVariable String email) {
        return userService.exists(email);
    }

    /*@GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }*/
}
