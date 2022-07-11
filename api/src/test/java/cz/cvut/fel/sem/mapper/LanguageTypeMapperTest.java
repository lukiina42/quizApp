package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.model.quizQuestion.LanguageType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;
import static org.junit.Assert.*;

@RunWith(MockitoJUnitRunner.class)
public class LanguageTypeMapperTest {
    @InjectMocks
    private LanguageTypeMapper sut;

    @Test
    public void mapStringToLanguageType_javaStringProvided_javaEnumReturned(){
        //Arrange
        String javaString = "text/x-java";

        //Act
        LanguageType actualResult = sut.mapStringToLanguageType(javaString);

        //Verify
        assertEquals(actualResult, LanguageType.JAVA);
    }

    @Test
    public void mapStringToLanguageType_cStringProvided_cEnumReturned(){
        //Arrange
        String cString = "text/x-csrc";

        //Act
        LanguageType actualResult = sut.mapStringToLanguageType(cString);

        //Verify
        assertEquals(actualResult, LanguageType.C);
    }

    @Test
    public void mapStringToLanguageType_cPlusPlusStringProvided_cPlusPlusEnumReturned(){
        //Arrange
        String cPlusPlusString = "text/x-c++src";

        //Act
        LanguageType actualResult = sut.mapStringToLanguageType(cPlusPlusString);

        //Verify
        assertEquals(actualResult, LanguageType.CPLUSPLUS);
    }

    @Test
    public void mapStringToLanguageType_plaintextStringProvided_plaintextEnumReturned(){
        //Arrange
        String plaintextString = "PLAINTEXT";

        //Act
        LanguageType actualResult = sut.mapStringToLanguageType(plaintextString);

        //Verify
        assertEquals(actualResult, LanguageType.PLAINTEXT);
    }

    @Test
    public void mapStringToLanguageType_pythonStringProvided_pythonEnumReturned(){
        //Arrange
        String pythonString = "text/x-python";

        //Act
        LanguageType actualResult = sut.mapStringToLanguageType(pythonString);

        //Verify
        assertEquals(actualResult, LanguageType.PYTHON);
    }

    @Test
    public void mapStringToLanguageType_invalidStringProvided_notFoundExceptionTrown(){
        //Arrange
        String invalidString = "invalid";

        //Act
        NotFoundException notFoundException = assertThrows(NotFoundException.class, () -> sut.mapStringToLanguageType(invalidString));

        //Verify
        assertEquals("Language" + invalidString + "not found", notFoundException.getMessage());
    }
}
