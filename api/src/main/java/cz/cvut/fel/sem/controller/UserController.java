package cz.cvut.fel.sem.controller;

import cz.cvut.fel.sem.controller.util.RestUtils;
import cz.cvut.fel.sem.dto.user.UserDto;
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

/**
 * Rest controller handling the requests from user
 * Again, the controller uses UserService, so all the methods are described there
 * @see UserService
 */
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
    public ResponseEntity<Long> createUser(@RequestBody User user) {
        Long userId = userService.persist(user);
        final HttpHeaders headers = RestUtils.createLocationHeaderFromCurrentUri("/{id}", user.getId());
        return new ResponseEntity<Long>(userId, headers, HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping(value = "/{email:.+}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Boolean getUserByEmail(@PathVariable String email) {
        return userService.exists(email);
    }

    @CrossOrigin
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> loginUser(@RequestBody User user) {
        final HttpHeaders headers = RestUtils.createLocationHeaderFromCurrentUri("/value");
        UserDto userToReturn = userService.checkLoginUser(user);
        return new ResponseEntity<>(userToReturn, headers, HttpStatus.OK);
    }
}
