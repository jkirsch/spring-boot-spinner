package demo.config;

import org.springframework.cloud.config.java.AbstractCloudConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

/**
 * Date: 03.02.2015
 *
 */
@Profile("cloud")
public class CloudConfig extends AbstractCloudConfig {

    @Bean(destroyMethod = "close")
    public javax.sql.DataSource dataSource() {
        return connectionFactory().dataSource();
    }

}
