package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.QuestionDto;
import cz.cvut.fel.sem.dto.question.QuizDto;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import cz.cvut.fel.sem.model.quizQuestion.Quiz;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import static org.junit.Assert.assertEquals;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class QuizMapperTest {
    @InjectMocks QuizMapper sut;

    @Mock QuestionMapper questionMapper;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @AfterEach
    public void afterEach() throws Exception {
        verifyNoMoreInteractions(questionMapper);
    }

    @Test
    public void mapToModel_validArgumentsProvided_modelObjectReturned(){
        //Arrange
        List<QuestionDto> dtoList = List.of(new QuestionDto(), new QuestionDto());
        QuizDto quizDto = new QuizDto(1L, "quizName", "quizDescription", dtoList);
        List<Question> questionList = List.of(new Question(), new Question());
        when(questionMapper.mapListToModel(eq(quizDto.getQuestions()), any())).thenReturn(questionList);

        //Act
        Quiz actualResult = sut.mapToModel(quizDto);

        //Verify
        assertEquals(java.util.Optional.of(1L), java.util.Optional.of(actualResult.getId()));
        assertEquals("quizName", actualResult.getName());
        assertEquals("quizDescription", actualResult.getDescription());
        assertEquals(questionList, actualResult.getQuestions());
    }

    @Test
    public void mapToDto_validArgumentsProvided_dtoObjectReturned(){
        //Arrange
        List<Question> questionList = List.of(new Question(), new Question());
        //TODO rewrite this, it does not work after adding owner to the quiz
        Quiz quiz = new Quiz(questionList, "quizDescription", "quizName", null);
        List<QuestionDto> dtoList = List.of(new QuestionDto(), new QuestionDto());
        when(questionMapper.mapListToDto(quiz.getQuestions())).thenReturn(dtoList);

        //Act
        QuizDto actualResult = sut.mapToDto(quiz);

        //Verify
        assertEquals("quizName", actualResult.getName());
        assertEquals("quizDescription", actualResult.getDescription());
        assertEquals(dtoList, actualResult.getQuestions());
    }
}
