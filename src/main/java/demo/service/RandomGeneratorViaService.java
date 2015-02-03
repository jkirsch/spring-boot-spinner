package demo.service;

import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * Date: 02.02.2015
 * Time: 19:18
 */
public class RandomGeneratorViaService implements RandomGeneratorService {

    final RestTemplate restTemplate;

    public RandomGeneratorViaService() {
        restTemplate = new RestTemplate();

    }

    @Override
    public Integer getNext(Integer max) {

        Map<String, String> params = new HashMap<>();

        params.put("num", "1");
        params.put("min", "1");
        params.put("max", max.toString());
        params.put("col", "1");
        params.put("base", "10");
        params.put("format", "plain");
        params.put("rnd", "new");

        if (max <= 1) {
            return max - 1;
        }

        String string = restTemplate.getForObject("https://www.random.org/integers/?num={num}&min=1&max={max}&col=1&base=10&format=plain&rnd=new", String.class, params);
        Scanner scanner = new Scanner(string);
        return scanner.nextInt() - 1;
    }
}
