package demo.service;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * Date: 02.02.2015
 * Time: 19:18
 */
@Component
public class RandomGeneratorViaService implements RandomGeneratorService {

    final RestTemplate restTemplate;
    Logger LOG = LoggerFactory.getLogger(RandomGeneratorViaService.class);

    SecureRandomGeneratorService secureRandomGeneratorService = new SecureRandomGeneratorService();

    public RandomGeneratorViaService() {
        restTemplate = new RestTemplate();

        LOG.info("Enabling random.org random number generator service");
    }

    @Override
    @HystrixCommand(fallbackMethod = "fallback",
            commandProperties = {
                    @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "800")
            }
    )
    public Integer selectNumber(Integer max) {

        if (max <= 1) {
            return max - 1;
        }

        Map<String, String> params = new HashMap<>();

        params.put("num", "1");
        params.put("min", "1");
        params.put("max", max.toString());
        params.put("col", "1");
        params.put("base", "10");
        params.put("format", "plain");
        params.put("rnd", "new");

        String string = restTemplate.getForObject("https://www.random.org/integers/?num={num}&min={min}&max={max}&col={col}&base={base}&format={format}&rnd=new", String.class, params);
        Scanner scanner = new Scanner(string);
        return scanner.nextInt() - 1;
    }


    public Integer fallback(Integer max) {
        return secureRandomGeneratorService.selectNumber(max);
    }
}
