# spring-boot-spinner
Sample repository to showcase spring boot

Mostly adapted from

https://spring.io/guides/gs/messaging-stomp-websocket/

The spinner is adapted from

https://github.com/JesseDahl/d3.spinner

# Dependencies

This project uses bower to manage the javascript dependencies
and nnpm do manage the build dependnecies for the frontend.

This is all integrated into the build chain

> mvn compile -P generate-frontend

This takes the sources found in `src/main/frontendsrc/main/frontend`
and builds a compressed and minified version into `src/main/webapp`
which is actually used.