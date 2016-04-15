package demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.AbstractSubProtocolEvent;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;
import java.util.concurrent.ConcurrentSkipListSet;

/**
 * Date: 06.02.2015
 * Time: 14:29
 */
@Service
public class NumberOfUsersService implements ApplicationListener<AbstractSubProtocolEvent> {

    @Autowired
    private MessageSendingOperations<String> messagingTemplate;

    private final Set<String> connected = new ConcurrentSkipListSet<>();

    @Override
    public void onApplicationEvent(AbstractSubProtocolEvent event) {
        if (event instanceof SessionConnectEvent) {
            String sessionId = (String) event.getMessage().getHeaders().get(SimpMessageHeaderAccessor.SESSION_ID_HEADER);
            add(sessionId);
        } else if (event instanceof SessionDisconnectEvent) {
            remove(((SessionDisconnectEvent) event).getSessionId());
        }
    }

    /**
     * Store the session ids currently connected.
     * Also broadcasts a new connected count.
     *
     * @param id Session ID
     */
    private void add(String id) {
        connected.add(id);
        messagingTemplate.convertAndSend("/topic/count", connected.size());
    }

    /**
     * Unregister a session id.
     *
     * @param id session id
     */
    private void remove(String id) {
        connected.remove(id);
        messagingTemplate.convertAndSend("/topic/count", connected.size());
    }

    /**
     * Gets the number of connected websocket sessions.
     *
     * @return number of connected sessions.
     */
    public int getConnected() {
        return connected.size();
    }

}
