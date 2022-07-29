package cz.cvut.fel.sem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.fel.sem.ApiApplication;
import cz.cvut.fel.sem.dto.question.AnswerDto;
import cz.cvut.fel.sem.dto.question.QuestionDto;
import cz.cvut.fel.sem.dto.question.QuestionTextDto;
import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.model.quizQuestion.*;
import cz.cvut.fel.sem.repository.QuizRepository;
import cz.cvut.fel.sem.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.junit.Assert.*;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = ApiApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class QuizControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    UserRepository userRepository;

    private final String QUESTIONNAME = "questionName";
    private final String QUIZNAME = "quizName";

    private QuizDto createQuizDto(){
        QuestionTextDto questionText = new QuestionTextDto("questionText", LanguageType.JAVA.toString());

        QuestionDto questionDto = new QuestionDto(
                1000,
                QuestionType.QUIZ,
                QUESTIONNAME,
                questionText,
                new AnswerDto("answer1", true),
                new AnswerDto("answer2", false),
                new AnswerDto(),
                new AnswerDto()
        );

        return new QuizDto(null, QUIZNAME, List.of(questionDto));
    }

    @Test
    public void createQuiz_validParameters_quizCreated() throws Exception{
        QuizDto quizDto = createQuizDto();

        User user = User.builder().email("foo@email.com").password("extraSecretPassword").build();
        user.setId(1L);

        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/quiz/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(quizDto)))
                .andExpect(status().isCreated());

        Quiz savedQuiz = quizRepository.findAll().get(0);

        assertEquals(QUIZNAME, savedQuiz.getName());
        assertEquals(QUESTIONNAME, savedQuiz.getQuestions().get(0).getName());
        assertEquals(user.getEmail(), savedQuiz.getOwner().getEmail());
    }

    @Test
    public void deleteQuiz_quizShouldBeDeleted() throws Exception{
        //save the quiz to database firstly
        QuizDto quizDto = createQuizDto();

        User user = User.builder().email("foo@email.com").password("extraSecretPassword").build();
        user.setId(1L);

        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/quiz/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(quizDto)))
                .andExpect(status().isCreated());

        Long savedQuizId = quizRepository.findAll().get(0).getId();

        mockMvc.perform(delete("/quiz/" + savedQuizId)
                .contentType("application/json"))
                .andExpect(status().isNoContent()).andReturn();

        assertEquals(0, quizRepository.findAll().size());
    }

    @Test
    public void findAll_allQuizzesOfUserFetched() throws Exception{
        //save the quiz to database firstly
        QuizDto quizDto = createQuizDto();
        QuizDto quizDto1 = createQuizDto();

        User user = User.builder().email("foo@email.com").password("extraSecretPassword").build();
        user.setId(1L);

        mockMvc.perform(post("/users")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/quiz/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(quizDto)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/quiz/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(quizDto1)))
                .andExpect(status().isCreated());

        List<Quiz> savedQuizzes = quizRepository.findAll();

        assertEquals(2, savedQuizzes.size());
    }
}
