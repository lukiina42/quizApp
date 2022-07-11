package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.AnswerDto;
import cz.cvut.fel.sem.model.quizQuestion.Answer;
import cz.cvut.fel.sem.model.quizQuestion.AnswerPosition;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class AnswerMapperTest {
    @InjectMocks private AnswerMapper sut;

    @Test
    public void mapToModel_answerDtoProvided_answerObjectWithCorrectValuesReturned(){
        //Arrange
        AnswerDto answerDto = new AnswerDto("answerValue", true);
        AnswerPosition answerPosition = AnswerPosition.TOPLEFT;
        Question question = new Question();

        //Act
        Answer actualResult = sut.mapToModel(answerDto, answerPosition, question);

        //Verify
        assertEquals("answerValue", actualResult.getValue());
        assertTrue(actualResult.isCorrect());
        assertEquals(AnswerPosition.TOPLEFT, actualResult.getAnswerPosition());
        assertEquals(question, actualResult.getQuestion());
    }

    @Test
    public void mapToDto_answerProvided_answerDtoObjectWithCorrectValuesReturned(){
        //Arrange
        Answer answer = new Answer("answerValue", true, AnswerPosition.TOPLEFT, new Question());

        //Act
        AnswerDto actualResult = sut.mapToDto(answer);

        //Verify
        assertEquals("answerValue", actualResult.getValue());
        assertTrue(actualResult.isCorrect());
    }

    @Test
    public void getSpecificAnswerDtoFromList_validArgumentsProvided_answerReturned(){
        //Arrange
        Answer answer = new Answer("answerValue", true, AnswerPosition.TOPLEFT, null);
        Answer answer2 = new Answer("answerValue2", true, AnswerPosition.TOPRIGHT, null);
        List<Answer> answersList = List.of(answer, answer2);

        //Act
        AnswerDto actualResult = sut.getSpecificAnswerDtoFromList(answersList, AnswerPosition.TOPRIGHT);

        //Verify
        assertEquals(answer2.getValue(), actualResult.getValue());
    }
}
