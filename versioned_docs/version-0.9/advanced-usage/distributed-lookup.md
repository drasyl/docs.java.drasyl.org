---
sidebar_position: 50
---
# Distributed Lookup

On this page you will learn how to integrate a distributed lookup service for the node that stores a desired data item.
The feature is based on the Chord protocol that provides support for just one operation: given a key, it maps the key onto a node.

If you would like to learn mor about this protocl, please refer to this paper:
> I. Stoica et al., "Chord: a scalable peer-to-peer lookup protocol for Internet applications," in
> IEEE/ACM Transactions on Networking, vol. 11, no. 1, pp. 17-32, Feb. 2003.
> 
> [https://doi.org/10.1109/TNET.2002.808407](https://doi.org/10.1109/TNET.2002.808407)

To use this feature, you have to use the [bootstrapping interface](./bootstrapping.md), where you have to customize the server channel's [ChannelInitializer](https://netty.io/4.0/api/io/netty/channel/ChannelInitializer.html).

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

## Establish Chord Circle

Chord constructs a distributed has table where each node is responsible for data items belonging to a partial keyspace.
To this end, all nodes are arranged in an ordered circle, where each node is equipped with a finger table that accelerates the traversal of the circle.

Below wee bootstrap a node that will either create a new circle, or if `contact` is set, tries to join an circle by contacting the given node:

```java title="ChordCircleNode.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.codec.OverlayMessageToEnvelopeMessageCodec;
import org.drasyl.handler.dht.chord.*;
import org.drasyl.handler.discovery.AddPathAndSuperPeerEvent;
import org.drasyl.handler.rmi.*;
import org.drasyl.identity.*;

public class ChordCircleNode {
    public static void main(final String[] args) {
        final Identity identity = /* code */;
        // highlight-start
        final long myId = ChordUtil.chordId(identity.getAddress());
        System.out.println("My Address : " + identity.getAddress());
        System.out.println("My Id      : " + ChordUtil.chordIdHex(myId) + " (" + ChordUtil.chordIdPosition(myId) + ")");
        // highlight-end

        final IdentityPublicKey contact = /* code */;

        final ServerBootstrap b = new ServerBootstrap()
                .group(new DefaultEventLoopGroup())
                .channel(DrasylServerChannel.class)
                .handler(new TraversingDrasylServerChannelInitializer(identity, new NioEventLoopGroup(1), 0) {
                    @Override
                    protected void initChannel(final DrasylServerChannel ch) {
                        super.initChannel(ch);

                        final ChannelPipeline p = ch.pipeline();

                        // highlight-start
                        // add RMI as our chord implementation relies on it
                        p.addLast(new OverlayMessageToEnvelopeMessageCodec());
                        p.addLast(new RmiCodec());
                        final RmiClientHandler client = new RmiClientHandler();
                        final RmiServerHandler server = new RmiServerHandler();
                        p.addLast(client);
                        p.addLast(server);

                        // add chord
                        final LocalChordNode localNode = new LocalChordNode(identity.getIdentityPublicKey(), client);
                        server.bind(LocalChordNode.BIND_NAME, localNode);
                        p.addLast(new ChordHousekeepingHandler(localNode));

                        if (contact != null) {
                            p.addLast(new ChannelDuplexHandler() {
                                @Override
                                public void userEventTriggered(final ChannelHandlerContext ctx,
                                                               final Object evt) {
                                    ctx.fireUserEventTriggered(evt);
                                    if (evt instanceof AddPathAndSuperPeerEvent) {
                                        p.addLast(new ChordJoinHandler(contact, localNode));
                                        ctx.pipeline().remove(ctx.name());
                                    }
                                }
                            });
                        }
                        // highlight-end
                    }
                })
                .childHandler(/* code */);
    }
}
```

## Lookup Node

Now its time to do lookups on the previously created chord circle.
Below wee bootstrap a node that will perform a chord lookup:

```java title="ChordLookupNode.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.codec.OverlayMessageToEnvelopeMessageCodec;
import org.drasyl.handler.dht.chord.*;
import org.drasyl.handler.rmi.*;
import org.drasyl.identity.*;

public class ChordLookupNode {
    public static void main(final String[] args) {
        final Identity identity = /* code */;
        // highlight-start
        final long myId = ChordUtil.chordId(identity.getAddress());
        System.out.println("My Address : " + identity.getAddress());
        System.out.println("My Id      : " + ChordUtil.chordIdHex(myId) + " (" + ChordUtil.chordIdPosition(myId) + ")");
        // highlight-end

        final IdentityPublicKey contact = /* code */;

        final ServerBootstrap b = new ServerBootstrap()
                .group(new DefaultEventLoopGroup())
                .channel(DrasylServerChannel.class)
                .handler(new TraversingDrasylServerChannelInitializer(identity, new NioEventLoopGroup(1)) {
                    @Override
                    protected void initChannel(final DrasylServerChannel ch) {
                        super.initChannel(ch);

                        final ChannelPipeline p = ch.pipeline();

                        // highlight-start
                        // add RMI as our chord implementation relies on it
                        p.addLast(new OverlayMessageToEnvelopeMessageCodec());
                        p.addLast(new RmiCodec());
                        final RmiClientHandler client = new RmiClientHandler();
                        final RmiServerHandler server = new RmiServerHandler();
                        p.addLast(client);
                        p.addLast(server);

                        // add chord
                        p.addLast(new ChordLookupHandler(client));

                        p.addLast(new SimpleChannelInboundHandler<ChordResponse>() {
                            @Override
                            protected void channelRead0(final ChannelHandlerContext ctx,
                                                        final ChordResponse msg) {
                                System.out.println("Hash " + ChordUtil.chordIdHex(msg.getId()) + " (" + ChordUtil.chordIdPosition(msg.getId()) + ") belongs to node " + msg.getAddress() + " (" + ChordUtil.chordIdPosition(msg.getAddress()) + ")");
                            }
                        });
                        // highlight-end
                    }
                })
                .childHandler(/* code */);
    }
}

```

We can now write `ChordLookup` messages to the channel. A response of such a lookup will be indicated by a `ChordResponse` message.
Listen on the Future returned by `Channel#writeAndFlush` to get updates on the (sucessfull) completion of the lookup.

Here's an snippet for that:
```java
channel.write(ChordLookup.of(contact, ChordUtil.chordId("ubuntu.iso"))).addListener((ChannelFutureListener) future -> {
    if (future.cause() != null) {
        future.cause().printStackTrace();
    }
});
```

## Example

A fully working example can be found [here](https://github.com/drasyl/drasyl/tree/master/drasyl-examples/src/main/java/org/drasyl/example/chord).
