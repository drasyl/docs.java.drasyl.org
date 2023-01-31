---
sidebar_position: 80
---
# Public Super Peers

Exposed drasyl nodes, configured as super peers and acting as rendezvous servers and relays, are required for discovery of other nodes.

We run some public super peers, so you don't have to.
By default, all drasyl nodes are configured to use the main network's super peers listed below.

## Main Network

This network has the id `1`.

### Baden-Baden, Germany (FKB 1)

```
udp://sp-fkb1.drasyl.org:22527?publicKey=c0900bcfabc493d062ecd293265f571edb70b85313ba4cdda96c9f77163ba62d&networkId=1
```

### Logroño, Spain (RJL 1)
```
udp://sp-rjl1.drasyl.org:22527?publicKey=5b4578909bf0ad3565bb5faf843a9f68b325dd87451f6cb747e49d82f6ce5f4c&networkId=1
```

### New York City, USA (NYC 1)
```
udp://sp-nyc1.drasyl.org:22527?publicKey=bf3572dba7ebb6c5ccd037f3a978707b5d7c5a9b9b01b56b4b9bf059af56a4e0&networkId=1
```

### Singapore (SGP 1)
```
udp://sp-sgp1.drasyl.org:22527?publicKey=ab7a1654d463f9986530bed00569cc895697827b802153b8ef1598579713045f&networkId=1
```

## Test Network

This network has the id `2`. Messages are not armed.
Therefore, if you are using `DrasylNode` make sure that `drasyl.remote.message.arm.protocol.enabled` is set to `false`.

### Hamburg, Germany
```
udp://sp-ham1.test.drasyl.org:22527?publicKey=c909a27d9ec0127c57142c3e1547ba9f82bc605277380b2a8fc0fabafe2be4c9&networkId=2
```
