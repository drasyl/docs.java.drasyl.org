---
sidebar_position: 40
---
# Membership Management

On this page we show you how to integrate the gossip-based membership management protocol CYCLON.
The CYCLON protocol generates a unstructured overlay sharing similarities with a random graph.
Beside membership management this protocol can be used for resource discovery (e.g., by performing a
random walk).

If you would like to learn mor about this protocl, please refer to this paper:
> Voulgaris, S., Gavidia, D. & van Steen, M. CYCLON: Inexpensive Membership Management for
> Unstructured P2P Overlays. J Netw Syst Manage 13, 197–217 (2005).
> 
> [https://doi.org/10.1007/s10922-005-4441-x](https://doi.org/10.1007/s10922-005-4441-x)

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

To use this protocol, you have to use the [bootstrapping interface](./bootstrapping.md), where you have to customize the server channel's ChannelInitializer.
Below you find a code snippet with a customized initializer including the Chord related handlers.
The `CyclonView` object passed to the handlers contains the local (partial) view of the network.
By calling `view.getNeighbors()` you will get a list of currently known neighbors and their corresponding addresses.
Please refer to the above-mentioned paper for choosing proper view size and shuffle size values.

```java title="MembershipManagement.java"
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import org.drasyl.channel.*;
import org.drasyl.handler.membership.cyclon.*;
import org.drasyl.identity.*;
import java.util.Set;

public class MembershipManagement {
    public static void main(final String[] args) {
        final Identity identity = /* code */;
        // highlight-start
        final int viewSize = 8; // maximum size of peers in own view
        final int shuffleSize = 4; // maximum number of peers to shuffle
        final int shuffleInterval = 10_000; // shuffle every 10 seconds
        final Set<DrasylAddress> initialNeighbors = Set.of(/* code */);
        final CyclonView view = CyclonView.ofKeys(viewSize, initialNeighbors);
        // highlight-end

        final ServerBootstrap b = new ServerBootstrap()
                .group(new DefaultEventLoopGroup())
                .channel(DrasylServerChannel.class)
                .handler(new TraversingDrasylServerChannelInitializer(identity, new NioEventLoopGroup(1), 0) {
                    @Override
                    protected void initChannel(final DrasylServerChannel ch) {
                        super.initChannel(ch);

                        final ChannelPipeline p = ch.pipeline();

                        // highlight-start
                        // (de)serialize cyclon messages 
                        p.addLast(new CyclonCodec());
                        // requests shuffle with random neighbor
                        p.addLast(new CyclonShufflingClientHandler(shuffleSize, shuffleInterval, view));
                        // responses to shuffle requests
                        p.addLast(new CyclonShufflingServerHandler(shuffleSize, view));
                        // highlight-end
                    }
                })
                .childHandler(/* code */);
    }
}
```

## Example

A fully working example can be found
here: [CyclonMembershipManagement](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-examples/src/main/java/org/drasyl/example/cyclon/CyclonMembershipManagement.java)
