package demo.config;

import com.google.common.base.Charsets;
import com.google.common.base.Joiner;
import org.apache.catalina.connector.Connector;
import org.apache.coyote.http11.AbstractHttp11Protocol;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

import javax.servlet.Filter;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Value("${server.port:8080}")
    String port;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/spinner").setAllowedOrigins("https://talk-spinner.herokuapp.com","http://talk-spinner.herokuapp.com","http://localhost:" + port).withSockJS();
    }

    @Bean
    public Filter encodingFilter() {
        final CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
        characterEncodingFilter.setEncoding(Charsets.UTF_8.name());
        characterEncodingFilter.setForceEncoding(true);
        return characterEncodingFilter;
    }

    // Another thing that is worth mentioning is that Tomcat only compresses content types of text/html, text/xml and text/plain by default.
    // Below is an example that supports compression of application/json as well:
    @Bean
    public EmbeddedServletContainerCustomizer servletContainerCustomizer() {
        return new EmbeddedServletContainerCustomizer() {
            @Override
            public void customize(ConfigurableEmbeddedServletContainer servletContainer) {
                ((TomcatEmbeddedServletContainerFactory) servletContainer).addConnectorCustomizers(
                        new TomcatConnectorCustomizer() {
                            @Override
                            public void customize(Connector connector) {
                                AbstractHttp11Protocol httpProtocol = (AbstractHttp11Protocol) connector.getProtocolHandler();
                                httpProtocol.setCompression("on");
                                httpProtocol.setCompressionMinSize(256);
                                String mimeTypes = httpProtocol.getCompressableMimeTypes();
                                String mimeTypesWithJson =
                                        mimeTypes + "," +
                                                Joiner.on(",")
                                                        .join(
                                                                MediaType.APPLICATION_JSON_VALUE,
                                                                "application/javascript",
                                                                "text/css");
                                httpProtocol.setCompressableMimeTypes(mimeTypesWithJson);
                            }
                        }
                );
            }
        };
    }

}