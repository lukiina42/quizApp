package cz.cvut.fel.sem.exception;

/**
 * Indicates that insufficient amount of a product is available for processing, e.g. for creating order items.
 */
public class InsufficientAmountException extends ApiException {

    public InsufficientAmountException(String message) {
        super(message);
    }
}
