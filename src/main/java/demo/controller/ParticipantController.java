package demo.controller;

import com.google.common.collect.Iterables;
import demo.domain.Participant;
import demo.repository.ParticipantRepository;
import demo.service.RandomGeneratorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.*;

/**
 * Date: 02.02.2015
 * Time: 12:25
 *
 */
@RestController
@RequestMapping("/participants")
public class ParticipantController {

    Logger LOG = LoggerFactory.getLogger(ParticipantController.class);

    @Autowired
    private MessageSendingOperations<String> messagingTemplate;

    @Autowired
    ParticipantRepository participantRepository;

    @RequestMapping("/")
    public Iterable<Participant> list() {
        return participantRepository.findAll();
    }

    @RequestMapping("/{id}")
    public Participant list(@PathVariable Integer id) {
        return participantRepository.findOne(id);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public boolean del(@PathVariable Integer id) {
        participantRepository.delete(id);
        messagingTemplate.convertAndSend("/topic/deleted", id);
        return true;
    }

    @Autowired
    RandomGeneratorService randomGenerator;

    @RequestMapping("/random")
    public Participant random() {
        // get a random element
        long count = participantRepository.count();
        int theIndex = randomGenerator.getNext((int) count);
        Participant participant = Iterables.get(participantRepository.findAll(), theIndex);

        // now update how often this participant was selected
        participant.addOne();
        // tell everyone
        messagingTemplate.convertAndSend("/topic/spin", participant);
        return participantRepository.save(participant);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public Participant add(@RequestBody Participant participant) {
        Participant save = participantRepository.save(participant);
        messagingTemplate.convertAndSend("/topic/added", save);
        return save;
    }

    // Websocket relay

    @SubscribeMapping("/participants")
    public Iterable<Participant> getParticipants() throws Exception {
        return participantRepository.findAll();
    }

    @MessageMapping("/remove")
    public void removeID(Integer id) {
        del(id);
    }


}
