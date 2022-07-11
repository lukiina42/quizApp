package cz.cvut.fel.sem.mapper;
import cz.cvut.fel.sem.dto.question.AnswerDto;
import cz.cvut.fel.sem.dto.question.QuestionDto;
import cz.cvut.fel.sem.dto.question.QuestionTextDto;
import cz.cvut.fel.sem.model.quizQuestion.*;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class QuestionMapperTest {
    @InjectMocks QuestionMapper sut;

    @Mock QuestionTextMapper questionTextMapper;

    @Mock AnswerMapper answerMapper;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @AfterEach
    public void afterEach() throws Exception {
        verifyNoMoreInteractions(questionTextMapper);
        verifyNoMoreInteractions(answerMapper);
    }

    @Test
    public void mapOneQuestionToModel_validArgumentsProvided_modelQuestionReturned(){
        //Arrange
        QuestionTextDto questionTextDto = new QuestionTextDto();
        AnswerDto answerToThemAll = new AnswerDto();
        QuestionDto questionDto = new QuestionDto(1, QuestionType.QUIZ, "questionName",
            questionTextDto, answerToThemAll, answerToThemAll, answerToThemAll, answerToThemAll);

        QuestionText questionText = mock(QuestionText.class);
        Answer answerToReturn = mock(Answer.class);
        Quiz emptyQuiz = mock(Quiz.class);
        when(questionTextMapper.mapToModel(eq(questionTextDto), any())).thenReturn(questionText);
        when(answerMapper.mapToModel(eq(answerToThemAll), any(), any())).thenReturn(answerToReturn);

        //Act
        Question actualResult = sut.mapOneQuestionToModel(questionDto, emptyQuiz);

        //Verify
        assertEquals(List.of(answerToReturn, answerToReturn, answerToReturn, answerToReturn), actualResult.getAnswers());
        assertEquals(questionText, actualResult.getQuestionText());
        assertEquals(1, actualResult.getKey());
        assertEquals(QuestionType.QUIZ, actualResult.getQuestionType());
        assertEquals("questionName", actualResult.getName());

        verifyNoMoreInteractions(questionText);
        verifyNoMoreInteractions(answerToReturn);
        verifyNoMoreInteractions(emptyQuiz);
    }

    @Test
    public void mapOneQuestionToDto_validArgumentsProvided_dtoQuestionReturned(){
        //Arrange
        QuestionText questionText = new QuestionText();
        Answer answer = new Answer();
        List<Answer> answerList = List.of(answer, answer, answer, answer);
        Quiz quiz = new Quiz();
        Question question = new Question(1, QuestionType.QUIZ, "questionName", questionText, answerList, quiz);

        QuestionTextDto questionTextDto = mock(QuestionTextDto.class);
        AnswerDto answerDto = mock(AnswerDto.class);
        when(questionTextMapper.mapToDto(questionText)).thenReturn(questionTextDto);
        when(answerMapper.getSpecificAnswerDtoFromList(eq(answerList), any())).thenReturn(answerDto);

        //Act
        QuestionDto actualResult = sut.mapOneQuestionToDto(question);

        //Verify
        assertEquals(answerDto, actualResult.getBottomLeftAnswer());
        assertEquals(answerDto, actualResult.getBottomRightAnswer());
        assertEquals(answerDto, actualResult.getTopLeftAnswer());
        assertEquals(answerDto, actualResult.getTopRightAnswer());
        assertEquals(questionTextDto, actualResult.getQuestionText());
        assertEquals(1, actualResult.getKey());
        assertEquals(QuestionType.QUIZ, actualResult.getQuestionType());
        assertEquals("questionName", actualResult.getName());

        verifyNoMoreInteractions(questionTextDto);
        verifyNoMoreInteractions(answerDto);
    }

    @Test
    public void mapListToModel_listProvided_correctAmountOfModelAnswersReturned(){
        //Arrange

        //Not giving any parameters to questionDto here,
        //because correct mapping of one dto entity to model is tested in previous test already
        QuestionDto questionDto = new QuestionDto();
        List<QuestionDto> dtoList = List.of(questionDto, questionDto, questionDto);

        //Act
        List<Question> actualResult = sut.mapListToModel(dtoList, null);

        //Verify
        assertEquals(3, actualResult.size());
    }

    @Test
    public void mapListToDto_listProvided_correctAmountOfDtoAnswersReturned(){
        //Arrange

        //Not giving any parameters to question here,
        //because correct mapping of one model entity to dto is tested in previous test already
        Question question = new Question();
        List<Question> questionList = List.of(question, question);

        //Act
        List<QuestionDto> actualResult = sut.mapListToDto(questionList);

        //Verify
        assertEquals(2, actualResult.size());
    }
}
