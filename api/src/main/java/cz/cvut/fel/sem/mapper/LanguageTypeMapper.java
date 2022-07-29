package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.exception.NotFoundException;
import cz.cvut.fel.sem.model.quizQuestion.LanguageType;
import org.springframework.stereotype.Component;

@Component
public class LanguageTypeMapper {
    /**
     * Maps language in string type to Enum type
     */
    public LanguageType mapStringToLanguageType(String language){
        switch (language){
            case "text/x-csrc":
                return LanguageType.C;
            case "text/x-c++src":
                return LanguageType.CPLUSPLUS;
            case "text/x-java":
                return LanguageType.JAVA;
            case "text/x-python":
                return LanguageType.PYTHON;
            case "PLAINTEXT":
                return LanguageType.PLAINTEXT;
            default:
                throw new NotFoundException("Language" + language + "not found");

        }
    }
}

