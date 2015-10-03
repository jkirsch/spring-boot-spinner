package demo.controller;

import com.google.common.collect.Iterables;
import demo.domain.Participant;
import demo.repository.ParticipantRepository;
import demo.service.NumberOfUsersService;
import demo.service.RandomGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

/**
 * The controller.
 *
 * Date: 02.02.2015
 * Time: 12:25
 */
@RestController
@RequestMapping("/participants")
public class ParticipantController {

    @Autowired
    private MessageSendingOperations<String> messagingTemplate;

    @Autowired
    ParticipantRepository participantRepository;

    @Autowired
    NumberOfUsersService numberOfUsersService;

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

    @RequestMapping(value = "/connected")
    public int connected() {
        return numberOfUsersService.getConnected();
    }

    @Autowired
    RandomGeneratorService randomGenerator;

    @RequestMapping("/random")
    @Transactional
    public Participant random() {
        // get a random element
        long count = participantRepository.count();
        if (count == 0) {
            throw new IllegalStateException("No entries found ...");
        }

        int theIndex = randomGenerator.selectNumber((int) count);
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


    // --------------------------------------------------------------------------
    // MESSAGING
    // --------------------------------------------------------------------------

    // Websocket relay

    @SubscribeMapping("/participants")
    public ReturnObject getParticipants() throws Exception {
        return new ReturnObject(participantRepository.findAll(), numberOfUsersService.getConnected());
    }

    @MessageMapping("/remove")
    public void removeID(Integer id) {
        del(id);
    }

    private static class ReturnObject {
        Iterable<Participant> entries;
        int connected;

        public ReturnObject(Iterable<Participant> entries, int connected) {
            this.entries = entries;
            this.connected = connected;
        }

        public Iterable<Participant> getEntries() {
            return entries;
        }

        public int getConnected() {
            return connected;
        }
    }

}
