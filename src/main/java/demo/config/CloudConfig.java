package demo.config;

import org.springframework.cloud.config.java.ServiceScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Date: 03.02.2015
 *
 */
@Configuration
@ServiceScan
@Profile("cloud")
public class CloudConfig {
}
