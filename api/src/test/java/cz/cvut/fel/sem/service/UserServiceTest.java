package cz.cvut.fel.sem.service;

import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.repository.UserRepository;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

/**
 * Tests UserService methods
 * Each method name follows naming convention: methodName_testedState_expectedOutput
 */
@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {
    @Mock private UserRepository userRepository;

    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks UserService sut;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @AfterEach
    public void afterEach() throws Exception {
        verifyNoMoreInteractions(userRepository);
        verifyNoMoreInteractions(passwordEncoder);
    }

    @Test
    public void getUserByEmail_userWithEmailExists_userWithEmailIsFound(){
        //Arrange
        User user = mock(User.class);
        String email = "testEmail";
        when(userRepository.findByEmail("testEmail")).thenReturn(user);

        //Act
        User actualUser = sut.getUserByEmail(email);

        //Verify
        assertEquals(user, actualUser);

        verifyNoMoreInteractions(user);
    }

    @Test
    public void getUserByEmail_userWithEmailDoesntExist_notFoundExceptionThrown(){
        //Arrange
        String email = "notExistingEmail";

        //Act
        NotFoundException result = assertThrows(NotFoundException.class, () -> sut.getUserByEmail(email));

        //Verify
        assertEquals("User with email" + email + " was not found", result.getMessage());
    }

    @Test
    public void getUserById_userWithIdExists_userWithIdIsFound(){
        //Arrange
        User user = mock(User.class);
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        //Act
        User actualUser = sut.getUserById(id);

        //Verify
        assertEquals(user, actualUser);

        verifyNoMoreInteractions(user);
    }

    @Test
    public void getUserById_userWithIdDoesntExist_notFoundExceptionThrown(){
        //Arrange
        Long id = 1L;

        //Act
        NotFoundException result = assertThrows(NotFoundException.class, () -> sut.getUserById(id));

        //Verify
        assertEquals("User with id" + id + " was not found", result.getMessage());
    }

    @Test
    public void exists_userWithEmailDoesntExist_returnsFalse(){
        //Arrange
        String email = "notExistingEmail";

        //Act
        boolean actualOutcome = sut.exists(email);

        //Verify
        assertFalse(actualOutcome);
    }

    @Test
    public void exists_userWithEmailExists_returnsTrue(){
        //Arrange
        String email = "existingEmail";
        User user = mock(User.class);
        when(userRepository.findByEmail(email)).thenReturn(user);

        //Act
        boolean actualOutcome = sut.exists(email);

        //Verify
        assertTrue(actualOutcome);

        verifyNoMoreInteractions(user);
    }

}
