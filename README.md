[![Build Status](https://travis-ci.org/jkirsch/spring-boot-spinner.svg)](https://travis-ci.org/jkirsch/spring-boot-spinner)
[![Dependency Status](https://gemnasium.com/jkirsch/spring-boot-spinner.svg)](https://gemnasium.com/jkirsch/spring-boot-spinner)
[![Dependency Status](https://www.versioneye.com/user/projects/558ef57f316338001e000160/badge.svg?style=flat)](https://www.versioneye.com/user/projects/558ef57f316338001e000160)

# spring-boot-spinner
Sample repository to showcase spring boot

Mostly adapted from

https://spring.io/guides/gs/messaging-stomp-websocket/

The spinner is adapted from

https://github.com/JesseDahl/d3.spinner

# Dependencies

This project uses bower to manage the javascript dependencies
and npm do manage the build dependencies for the frontend.

This is all integrated into the maven build chain

> mvn compile -P generate-frontend

This takes the sources found in `src/main/frontend`
and builds a compressed and minified version into `src/main/webapp`
which is actually used.

Gulp is used as frontend build tool. For simplicity the minified resources are checked in.

A good introduction to merging the frontend and backend toolchain can be found here

> Spring Framework 4.1 Resource Handling example
> https://github.com/bclozel/spring-resource-handling/tree/master

To start in development mode, set the spring profile to `development` and
the `src/main/frontend` folder will be served directly.

