package cz.cvut.fel.sem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.fel.sem.ApiApplication;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = ApiApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class UserControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Test
    public void createUser_userIsSavedToDBWithCorrectCredentials() throws Exception {
        User user = User.builder().email("foo@email.com").password("extraSecretPassword").build();

        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        User savedUser = userRepository.findByEmail("foo@email.com");

        assertEquals("foo@email.com", savedUser.getEmail());
        assertTrue(passwordEncoder.matches(user.getPassword(), savedUser.getPassword()));
    }

    @Test
    public void getUserByEmail_emailExistsInDatabase_returnTrue() throws Exception {
        //first save user to the database
        User user = User.builder().email("foo@email.com").password("extraSecretPassword").build();

        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        User savedUser = userRepository.findByEmail("foo@email.com");
        assertNotNull(savedUser);

        //perform the tested request
        MvcResult result = mockMvc.perform(get("/users/foo@email.com")).andReturn();

        assertEquals("true", result.getResponse().getContentAsString());
    }

    @Test
    public void getUserByEmail_emailDoesNotExistInDatabase_returnFalse() throws Exception {
        //perform the tested request
        MvcResult result = mockMvc.perform(get("/users/foo@email.com")).andReturn();

        assertEquals("false", result.getResponse().getContentAsString());
    }

    @Test
    public void loginUser_existingCredentials_userReturnedAndOkStatus() throws Exception{
        //first save user to the database
        User user = User.builder().email("foo@email.com").password("extraSecretPassword").build();

        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        User savedUser = userRepository.findByEmail("foo@email.com");
        assertNotNull(savedUser);

        MvcResult result = mockMvc.perform(post("/users/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andReturn();

        User loggedUser = objectMapper.readValue(result.getResponse().getContentAsString(), User.class);
        assertEquals("foo@email.com", loggedUser.getEmail());
    }

    @Test
    public void loginUser_wrongCredentials_emptyUserReturnedAndOkStatus() throws Exception{
        User user = User.builder().email("wrong@email.com").password("extraSecretPassword").build();

        MvcResult result = mockMvc.perform(post("/users/login")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andReturn();

        User notLoggedUser = objectMapper.readValue(result.getResponse().getContentAsString(), User.class);
        assertEquals("", notLoggedUser.getEmail());
        assertEquals(java.util.Optional.of(0L), java.util.Optional.of(notLoggedUser.getId()));
    }
}
