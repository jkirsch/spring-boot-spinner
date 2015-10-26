package demo.service;

import org.junit.Assert;
import org.junit.Test;

import static org.hamcrest.Matchers.lessThan;

public class SecureRandomGeneratorServiceTest {

    @Test
    public void testGetNext() throws Exception {

        SecureRandomGeneratorService secureRandomGeneratorService = new SecureRandomGeneratorService();

        for (int i = 0; i < 10; i++) {
            Integer next = secureRandomGeneratorService.selectNumber(10);
            Assert.assertThat(next, lessThan(10));
        }

    }
}