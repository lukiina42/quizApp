package cz.cvut.fel.sem.config;

import cz.cvut.fel.sem.service.session.UserHandshakeHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


/**
 * Web socket connection configuration
 * Handles the start of the connection
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Sets up the endpoints of the application
     * Application destination prefix is the prefix where the server listens to the requests from the client
     * Simple broker is the default destination where server sends the messages
     * @param config
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/ws");
    }

    /**
     * Registers the client connections when the client makes the connection.
     * setHandshakeHandler method assigns unique id to each user who connects. The server
     * can then send the messages to specific users with ids.
     * Also CORS is configured here
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // with sockjs
        registry.addEndpoint("/ws-session").setAllowedOrigins("*").setHandshakeHandler(new UserHandshakeHandler()).withSockJS();
    }
}