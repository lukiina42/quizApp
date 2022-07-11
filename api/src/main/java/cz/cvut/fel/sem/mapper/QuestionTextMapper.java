package cz.cvut.fel.sem.mapper;

import cz.cvut.fel.sem.dto.question.QuestionTextDto;
import cz.cvut.fel.sem.model.quizQuestion.QuestionText;
import cz.cvut.fel.sem.model.quizQuestion.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class QuestionTextMapper {
    private final LanguageTypeMapper languageTypeMapper;

    @Autowired
    public QuestionTextMapper(LanguageTypeMapper languageTypeMapper) {
        this.languageTypeMapper = languageTypeMapper;
    }

    public QuestionText mapToModel(QuestionTextDto questionTextDto, Question question){
        return new QuestionText(
                questionTextDto.getValue(),
                languageTypeMapper.mapStringToLanguageType(questionTextDto.getLanguage()),
                question);
    }

    public QuestionTextDto mapToDto(QuestionText questionText){
        return new QuestionTextDto(questionText.getValue(), questionText.getLanguageType().toString());
    }
}
