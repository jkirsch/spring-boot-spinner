package demo.service;

import java.security.SecureRandom;

/**
 * Date: 02.02.2015
 * Time: 19:42
 *
 */
public class SecureRandomGeneratorService implements RandomGeneratorService {

    SecureRandom rand = new SecureRandom();

    @Override
    public Integer getNext(Integer max) {
        return rand.nextInt(max);
    }
}
