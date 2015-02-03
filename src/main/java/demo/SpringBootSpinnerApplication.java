package demo;

import demo.service.RandomGeneratorService;
import demo.service.RandomGeneratorViaService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class SpringBootSpinnerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootSpinnerApplication.class, args);
    }

    @Bean
    RandomGeneratorService random() {
        return new RandomGeneratorViaService();
    }

}
