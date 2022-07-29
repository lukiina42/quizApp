package cz.cvut.fel.sem.service;

import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.mapper.QuizMapper;
import cz.cvut.fel.sem.model.User;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import cz.cvut.fel.sem.repository.QuizRepository;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

import java.util.List;

@RunWith(MockitoJUnitRunner.class)
public class QuizServiceTest {
    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuizMapper quizMapper;
    @Mock
    private UserService userService;

    @InjectMocks
    private QuizService sut;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @AfterEach
    public void afterEach() throws Exception {
        verifyNoMoreInteractions(quizMapper);
        verifyNoMoreInteractions(quizRepository);
    }

    @Test
    public void getAllQuizzes_fetchingAllQuizzes_AllQuizzesReturned(){
        //Arrange
        Quiz quiz1 = mock(Quiz.class);
        Quiz quiz2 = mock(Quiz.class);
        QuizDto quizDto1 = mock(QuizDto.class);
        QuizDto quizDto2 = mock(QuizDto.class);
        User user = mock(User.class);
        when(quizDto1.getName()).thenReturn("Quiz1");
        when(quizDto2.getName()).thenReturn("Quiz2");
        when(quizMapper.mapToDto(quiz1)).thenReturn(quizDto1);
        when(quizMapper.mapToDto(quiz2)).thenReturn(quizDto2);
        List<Quiz> quizList = List.of(quiz1, quiz2);
        when(quizRepository.findAllByOwner(user)).thenReturn(quizList);
        when(userService.getUserById(1L)).thenReturn(user);

        //Act
        List<QuizDto> dtoQuizzes = sut.getAllQuizzesOfUser(1L);

        //Verify
        assertEquals(2, dtoQuizzes.size());
        assertEquals(1, dtoQuizzes.stream().filter(quizDto -> quizDto.getName().equals("Quiz1")).count());
        assertEquals(1, dtoQuizzes.stream().filter(quizDto -> quizDto.getName().equals("Quiz2")).count());

        Mockito.verify(quizDto2, times(2)).getName();
        Mockito.verify(quizDto1, times(2)).getName();
        verifyNoMoreInteractions(quiz1);
        verifyNoMoreInteractions(quiz2);
        verifyNoMoreInteractions(quizDto1);
        verifyNoMoreInteractions(quizDto2);
    }

    @Test
    public void getQuizById_existingIdProvided_quizFetched(){
        //Arrange
        Long id = 1L;
        Quiz quiz = mock(Quiz.class);
        when(quizRepository.getOne(id)).thenReturn(quiz);

        //Act
        Quiz actualQuiz = sut.getQuizById(id);

        //Verify
        assertEquals(quiz, actualQuiz);

        verifyNoMoreInteractions(quiz);

    }

    @Test
    public void getQuizById_notExistingIdProvided_notFoundExceptionThrown(){
        //Arrange
        Long id = 1L;

        //Act
        NotFoundException result = assertThrows(NotFoundException.class, () -> sut.getQuizById(id));

        //Verify
        assertEquals("Quiz with id " + id + "was not found", result.getMessage());

    }
}
