package demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;

/**
 * Date: 02.02.2015
 * Time: 19:42
 *
 */
public class SecureRandomGeneratorService implements RandomGeneratorService {

    SecureRandom rand = new SecureRandom();

    Logger LOG = LoggerFactory.getLogger(SecureRandomGeneratorService.class);

    @Override
    public Integer getNext(Integer max) {
        LOG.info("Fallback random number");
        return rand.nextInt(max);
    }
}
