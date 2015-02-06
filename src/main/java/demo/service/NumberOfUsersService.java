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
 *
 */
@Service
public class NumberOfUsersService implements ApplicationListener<AbstractSubProtocolEvent>{

    @Autowired
    private MessageSendingOperations<String> messagingTemplate;

    Set<String> connected = new ConcurrentSkipListSet<>();

    @Override
    public void onApplicationEvent(AbstractSubProtocolEvent event) {
        if (event instanceof SessionConnectEvent) {
            String sessionId = (String) event.getMessage().getHeaders().get(SimpMessageHeaderAccessor.SESSION_ID_HEADER);
            add(sessionId);
        } else if (event instanceof SessionDisconnectEvent) {
            remove(((SessionDisconnectEvent) event).getSessionId());
        }
    }

    // add
    private void add(String id) {
        connected.add(id);
        messagingTemplate.convertAndSend("/topic/count", connected.size());
    }

    private void remove(String id) {
        connected.remove(id);
        messagingTemplate.convertAndSend("/topic/count", connected.size());
    }

    public int getConnected() {
        return connected.size();
    }

}
