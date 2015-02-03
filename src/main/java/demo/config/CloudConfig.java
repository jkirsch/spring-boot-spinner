package demo.config;

import org.springframework.cloud.config.java.AbstractCloudConfig;
import org.springframework.cloud.config.java.ServiceScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

/**
 * Date: 03.02.2015
 *
 */
@Profile("cloud")
@ServiceScan
public class CloudConfig extends AbstractCloudConfig {

    @Bean(destroyMethod = "close")
    public javax.sql.DataSource dataSource() {
        return connectionFactory().dataSource();
    }

}
