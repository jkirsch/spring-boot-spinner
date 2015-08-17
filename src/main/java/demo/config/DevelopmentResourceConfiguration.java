package demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.io.File;

/**
 * When the development profile is set, we serve the uncompressed frontend directory directly.
 */
@Configuration
@Profile("development")
public class DevelopmentResourceConfiguration extends WebMvcConfigurerAdapter {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // if we are in development mode serve the frontend folder directly
        registry.addResourceHandler("/**")
                .addResourceLocations("file:///" +new File(".").getAbsolutePath()+ "/src/main/frontend/");
    }
}