package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.QuestionTextDto;
import cz.cvut.fel.sem.model.quizQuestion.LanguageType;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import cz.cvut.fel.sem.model.quizQuestion.QuestionText;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.Mockito.*;
import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class QuestionTextMapperTest {
    @InjectMocks QuestionTextMapper sut;

    @Mock LanguageTypeMapper languageTypeMapper;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @AfterEach
    public void afterEach() throws Exception {
        verifyNoMoreInteractions(languageTypeMapper);
    }

    @Test
    public void mapToModel_validArgumentsProvided_modelObjectReturned(){
        //Arrange
        QuestionTextDto questionTextDto = new QuestionTextDto("questionTextValue", "text/x-java");
        when(languageTypeMapper.mapStringToLanguageType("text/x-java")).thenReturn(LanguageType.JAVA);
        Question question = new Question();

        //Act
        QuestionText actualResult = sut.mapToModel(questionTextDto, question);

        //Verify
        assertEquals(LanguageType.JAVA, actualResult.getLanguageType());
        assertEquals("questionTextValue", actualResult.getValue());
        assertEquals(question, actualResult.getQuestion());
    }

    @Test
    public void mapToDto_validArgumentsProvided_dtoObjectReturned(){
        //Arrange
        QuestionText questionText = new QuestionText("questionTextValue", LanguageType.C, new Question());

        //Act
        QuestionTextDto actualResult = sut.mapToDto(questionText);

        //Verify
        assertEquals("questionTextValue", actualResult.getValue());
        assertEquals("text/x-csrc", actualResult.getLanguage());
    }
}
