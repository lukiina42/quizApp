package cz.cvut.fel.sem.model.quizQuestion;

public enum LanguageType {
    C("text/x-csrc"),
    CPLUSPLUS("text/x-c++src"),
    JAVA("text/x-java"),
    PYTHON("text/x-python"),
    PLAINTEXT("PLAINTEXT");

    private final String value;
    private LanguageType(final String value)
    {
        this.value = value;
    }

    public String toString()
    {
        return this.value;
    }
}
