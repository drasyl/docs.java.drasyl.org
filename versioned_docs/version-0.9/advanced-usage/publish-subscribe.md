---
sidebar_position: 20
---
# Publish/Subscribe Messaging

Publish/Subscribe is messaging pattern where senders of messages (a so-called publisher) do not directly send messages to specific receivers (so-called subscriber).
Instead, all published messages are categorizes and are sent to a broker.
This broker keeps track of each subsciber's interests and will forward published messages accordingly.

On this page, you will learn how this messagging pattern is used with drasyl.
We provide ready-to-use broker, subscriber, and publisher components for simple topic-based communication.

### Add Dependency

Maven:
```xml title="pom.xml"
<dependency>
    <groupId>org.drasyl</groupId>
    <artifactId>drasyl-extras</artifactId>
    <version>0.9.0</version>
</dependency>
```

Other dependency managers:
```
Gradle : compile "org.drasyl:drasyl-extras:0.9.0" // build.gradle 
   Ivy : <dependency org="org.drasyl" name="drasyl-extras" rev="0.9.0" conf="build" /> // ivy.xml
   SBT : libraryDependencies += "org.drasyl" % "drasyl-extras" % "0.9.0" // build.sbt
```

## Broker

The first thing we need to do is create a broker.
For this you have to use the [bootstrapping interface](./bootstrapping.md), where you have to customize the server channel's ChannelInitializer.

```java title="Broker.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.pubsub.*;
import org.drasyl.identity.Identity;

public class Broker {
    public static void main(final String[] args) {
        final Identity identity = /* code */;

        final ServerBootstrap b = new ServerBootstrap()
                .group(new DefaultEventLoopGroup())
                .channel(DrasylServerChannel.class)
                .handler(new TraversingDrasylServerChannelInitializer(identity, new NioEventLoopGroup(1), 22527) {
                    @Override
                    protected void initChannel(final DrasylServerChannel ch) {
                        super.initChannel(ch);

                        final ChannelPipeline p = ch.pipeline();

                        // highlight-start
                        p.addLast(new PubSubCodec());
                        p.addLast(new PubSubBrokerHandler());
                        // highlight-end
                    }
                })
                .childHandler(/* code */);
    }
}

```

## Subscriber

A subscriber which prints all received messages via `System.out` is defined as follows:
```java title="Subscriber.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBufUtil;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.pubsub.*;
import org.drasyl.identity.*;
import static java.nio.charset.StandardCharsets.UTF_8;

public class Subscriber {
    public static void main(final String[] args) {
        final Identity identity = /* code */;
        final DrasylAddress brokerAddress = /* code */;

        final ServerBootstrap b = new ServerBootstrap()
                .group(new DefaultEventLoopGroup())
                .channel(DrasylServerChannel.class)
                .handler(new TraversingDrasylServerChannelInitializer(identity, new NioEventLoopGroup(1), 0) {
                    @Override
                    protected void initChannel(final DrasylServerChannel ch) {
                        super.initChannel(ch);

                        final ChannelPipeline p = ch.pipeline();
                        
                        // highlight-start
                        p.addLast(new PubSubCodec());
                        p.addLast(new PubSubSubscribeHandler(brokerAddress));
                        p.addLast(new SimpleChannelInboundHandler<PubSubPublish>() {
                            @Override
                            protected void channelRead0(ChannelHandlerContext ctx,
                                                        PubSubPublish msg) {
                                System.out.println("Got publication for topic `" + msg.getTopic() + "`: " + new String(ByteBufUtil.getBytes(msg.getContent()), UTF_8));
                            }
                        });
                        // highlight-end
                    }
                })
                .childHandler(/* code */);
    }
}
```

Using specialized messages, the subscriber can now be instructed to (de)subscribe to specific topics:

```java title="Subscriber.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBufUtil;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.pubsub.*;
import org.drasyl.identity.*;
import static java.nio.charset.StandardCharsets.UTF_8;

public class Subscriber {
    public static void main(final String[] args) {
        /* code */

        final Channel ch = b.bind(identity.getAddress()).syncUninterruptibly().channel();

        // highlight-start
        // subscribe to topic "animal/cat". Returned future will succeed once broker sent confirmation.
        final ChannelFuture subscribed = ch.writeAndFlush(PubSubSubscribe.of("animal/cat"));
        // highlight-end

        // highlight-start
        // unsubscribe from topic "animal/cat. Returned future will succeed once broker sent confirmation.
        final ChannelFuture unsubscribed = ch.writeAndFlush(PubSubUnsubscribe.of("animal/cat"));
        // highlight-end
    }
}
```


## Publisher

Again, first we need to bootstrap a publisher:
```java title="Publisher.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.pubsub.*;
import org.drasyl.identity.*;

public class Publisher {
    public static void main(final String[] args) {
        final Identity identity = /* code */;
        final DrasylAddress brokerAddress = /* code */;

        final ServerBootstrap b = new ServerBootstrap()
                .group(new DefaultEventLoopGroup(1))
                .channel(DrasylServerChannel.class)
                .handler(new TraversingDrasylServerChannelInitializer(identity, new NioEventLoopGroup(1), 0) {
                    @Override
                    protected void initChannel(final DrasylServerChannel ch) {
                        super.initChannel(ch);

                        final ChannelPipeline p = ch.pipeline();

                        // highlight-start
                        p.addLast(new PubSubCodec());
                        p.addLast(new PubSubPublishHandler(brokerAddress));
                        // highlight-start
                    }
                })
                .childHandler(/* code */);
    }
}
```

Finally, we can start publishing messages as follows:
```java title="Publisher.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.pubsub.*;
import org.drasyl.identity.*;

import static java.nio.charset.StandardCharsets.UTF_8;

public class Publisher {
    public static void main(final String[] args) {
        /* code */

        final Channel ch = b.bind(identity.getAddress()).syncUninterruptibly().channel();

        // highlight-start
        // publish message to topic "animal/cat"
        ch.writeAndFlush(PubSubPublish.of("animal/cat", Unpooled.copiedBuffer("F. D. C. Willard", UTF_8)));
        // highlight-end
    }
}
```

## Example

A working example can be found
in our [examples section](https://github.com/drasyl/drasyl/tree/master/drasyl-examples/src/main/java/org/drasyl/example/pubsub).
