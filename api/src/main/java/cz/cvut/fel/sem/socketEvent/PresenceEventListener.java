package cz.cvut.fel.sem.socketEvent;

import cz.cvut.fel.sem.service.session.SessionService;
import org.springframework.context.event.EventListener;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;

/**
 * Listener to track user presence - specifically user disconnect.
 */
public class PresenceEventListener {
    private final SessionService sessionService;

    public PresenceEventListener(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    /**
     * Gets triggered when user disconnects from the quiz
     * @param event containing user id, which is passed to session service and other user info
     */
    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        sessionService.handleSocketDisconnect(Objects.requireNonNull(event.getUser()).getName());
    }
}