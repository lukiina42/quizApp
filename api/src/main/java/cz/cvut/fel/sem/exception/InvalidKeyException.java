package cz.cvut.fel.sem.exception;

public class InvalidKeyException extends ApiException {
    public InvalidKeyException(String message) {
        super(message);
    }

    public InvalidKeyException(String message, Throwable cause) {
        super(message, cause);
    }

    public static InvalidKeyException create(String resourceName, Object identifier) {
        return new InvalidKeyException(resourceName + " identified by " + identifier + " not found.");
    }
}
