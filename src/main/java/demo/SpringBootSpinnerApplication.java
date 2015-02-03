package demo;

import demo.service.RandomGeneratorService;
import demo.service.SecureRandomGeneratorService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
@Configuration
public class SpringBootSpinnerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootSpinnerApplication.class, args);
    }

    @Bean
    RandomGeneratorService random() {
        return new SecureRandomGeneratorService();
    }

}
