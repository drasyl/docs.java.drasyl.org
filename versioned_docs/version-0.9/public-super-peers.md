---
sidebar_position: 80
---
# Public Super Peers

Exposed drasyl nodes, configured as super peers and acting as rendezvous servers and relays, are required for discovery of other nodes.

We run some public super peers, so you don't have to.
By default, all drasyl nodes are configured to use the super peers [`sp-fra1.drasyl.org`](#frankfurt-germany-fra-1-baden-baden-germany-fkb-1)
and [`sp-nbg2.drasyl.org`](#nuremberg-germany-nbg-2-logroño-spain-rjl-1).

:::info
We have moved to a new set of super peers more globally spread worldwide (New York, Singapore, Spain, Germany).
To allow 0.9.0 drasyl nodes to use these new super peers, we replaced Frankfurt and Nuremberg on DNS-level with Baden-Baden and Logroño.
:::

## ~~Frankfurt, Germany (FRA 1)~~ Baden-Baden, Germany (FKB 1)

```
udp://sp-fra1.drasyl.org:22527?publicKey=c0900bcfabc493d062ecd293265f571edb70b85313ba4cdda96c9f77163ba62d&networkId=1
```

## ~~Nuremberg, Germany (NBG 2)~~ Logroño, Spain (RJL 1)

```
udp://sp-nbg2.drasyl.org:22527?publicKey=5b4578909bf0ad3565bb5faf843a9f68b325dd87451f6cb747e49d82f6ce5f4c&networkId=1
```
