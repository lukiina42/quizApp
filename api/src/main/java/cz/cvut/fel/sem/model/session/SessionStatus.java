package cz.cvut.fel.sem.model.session;

/**
 * Describes current status of the session
 * OPENEDFORCONNECTIONS: users can connect to the session in this case
 * ACTIVE: the session is active but users cannot join the session anymore
 * INACTIVE: the session is ended and users cannot join
 */
public enum SessionStatus {
    OPENEDFORCONNECTIONS,
    ACTIVE,
    COMPLETED
}
