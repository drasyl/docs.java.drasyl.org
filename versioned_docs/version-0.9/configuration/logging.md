---
sidebar_position: 3
---
# Logging

To use logging, you must configure it via the [SLF4J](http://www.slf4j.org/) backend, such as
[Logback](http://logback.qos.ch/):

## Add Dependency

Maven:
```xml title="pom.xml"
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.11</version>
</dependency>
```

Other dependency managers:
```
Gradle : compile "ch.qos.logback:logback-classic:1.2.3" // build.gradle 
   Ivy : <dependency org="ch.qos.logback" name="logback-classic" rev="1.2.3" conf="build" /> // ivy.xml
   SBT : libraryDependencies += "ch.qos.logback" % "logback-classic" % "1.2.3" // build.sbt
```

## Example Configuration
```xml title="logback.xml"
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <logger name="io.netty" level="WARN" />
    
    <root level="debug">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```
