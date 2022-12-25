# Run a Node

The command `node` allows you to run a drasyl node:

```bash
$ drasyl help node
Run a drasyl node.
Can, for example, be used to operate a super peer

Usage: drasyl node [--activity-pattern=<file>] [-c=<file>] [--rc-bind=<host>[:
                   <port>]] [--rc-events-buffer-size=<count>] [-v=<level>]
                   [--rc-jsonrpc-tcp | --rc-jsonrpc-http]

      --activity-pattern=<file>
                          If supplied, the node will perform the given
                            activities (e.g., send message, sleep, loop, etc.)
                            specified in the file once started.
  -c, --config=<file>     Loads the node configuration from specified file. If
                            the file does not exist, the default config will be
                            used.
                            Default: drasyl.conf
      --rc-bind=<host>[:<port>]
                          Binds remote control server to given IP and port. If
                            no port is specified, a random free port will be
                            used.
                            Default: 0.0.0.0:25421
      --rc-events-buffer-size=<count>
                          Maximum number of events that the buffer can hold.
                          On overflow, new events will push oldest events out
                            of the buffer.
                          A value of 0 disables the limit (can lead to out of
                            memory error).
                            Default: 1000
      --rc-jsonrpc-http   Starts a JSON-RPC 2.0 over HTTP server listening on
                            remote requests.
                          If this option is set, the node needs to be started
                            manually.
                          Available methods: start, shutdown, send, identity,
                            events
      --rc-jsonrpc-tcp    Starts a JSON-RPC 2.0 over TCP server listening on
                            remote requests.
                          If this option is set, the node needs to be started
                            manually.
                          Available methods: start, shutdown, send, identity,
                            events
  -v, --verbose=<level>   Sets the log level (available values: off, error,
                            warn, info, debug, trace).
                            Default: warn
```

## Remote Controlling

### HTTP API

If the command is run with the `--rc-jsonrpc-http` flag then it starts an HTTP server which can be used to remote control the node using its API.

#### Start Node

```bash
$ curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","method":"start","id":1}' \
     http://127.0.0.1:25421
{"jsonrpc":"2.0","result":"","id":1}
```

#### Shutdown Node

```bash
$ curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","method":"shutdown","id":2}' \
     http://127.0.0.1:25421
{"jsonrpc":"2.0","result":"","id":2}
```

#### Send Message

```bash
$ curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","method":"send","params":{"recipient":"366a48151e16befa5ae46bd7ad8fa3d3f2dfe0cd2ee29837aa257bab9e332922","payload":"Hello World"},"id":3}' \
     http://127.0.0.1:25421
{"jsonrpc":"2.0","result":"","id":3}
```

#### Get Identity

```bash
$ curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","method":"identity","id":4}' \
     http://127.0.0.1:25421
{"jsonrpc":"2.0","result":{"identityKeyPair":{"secretKey":"3e6499116ba86b4884345891f3421a5a16c902247326928ce41c10ad8a66bd1f668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4","publicKey":"668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4"},"agreementKeyPair":{"secretKey":"3861685f7a54ea9c6e6eb3fdb6d0d00cffda1cda91e93dc1bfb9838fae1ef05a","publicKey":"5f63d6a50f75962a832be4236dc3e3757fad93bd19f59f40576c0596afef1d4e"},"proofOfWork":-2140756759},"id":4}
```

#### Get Events

```bash
$ curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","method":"events","id":5}' \
     http://127.0.0.1:25421
{"jsonrpc":"2.0","result":[{"type":"NodeUpEvent","node":{"identity":{"proofOfWork":-2140756759,"agreementKeyPair":{"publicKey":"5f63d6a50f75962a832be4236dc3e3757fad93bd19f59f40576c0596afef1d4e","secretKey":"3861685f7a54ea9c6e6eb3fdb6d0d00cffda1cda91e93dc1bfb9838fae1ef05a"},"identityKeyPair":{"publicKey":"668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4","secretKey":"3e6499116ba86b4884345891f3421a5a16c902247326928ce41c10ad8a66bd1f668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4"}},"tcpFallbackPort":0,"port":0}},{"type":"PeerDirectEvent","peer":{"address":"c0900bcfabc493d062ecd293265f571edb70b85313ba4cdda96c9f77163ba62d"}},{"type":"NodeOnlineEvent","node":{"identity":{"proofOfWork":-2140756759,"agreementKeyPair":{"publicKey":"5f63d6a50f75962a832be4236dc3e3757fad93bd19f59f40576c0596afef1d4e","secretKey":"3861685f7a54ea9c6e6eb3fdb6d0d00cffda1cda91e93dc1bfb9838fae1ef05a"},"identityKeyPair":{"publicKey":"668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4","secretKey":"3e6499116ba86b4884345891f3421a5a16c902247326928ce41c10ad8a66bd1f668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4"}},"tcpFallbackPort":0,"port":0}},{"type":"PeerDirectEvent","peer":{"address":"5b4578909bf0ad3565bb5faf843a9f68b325dd87451f6cb747e49d82f6ce5f4c"}},{"type":"PeerDirectEvent","peer":{"address":"bf3572dba7ebb6c5ccd037f3a978707b5d7c5a9b9b01b56b4b9bf059af56a4e0"}},{"type":"PeerDirectEvent","peer":{"address":"ab7a1654d463f9986530bed00569cc895697827b802153b8ef1598579713045f"}}],"id":5}
```

### TCP API

If the command is run with the `--rc-jsonrpc-tcp` flag then it starts an TCP server which can be used to remote control the node using its API.

#### Start Node

```bash
$ telnet 127.0.0.1 25421
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
{"jsonrpc":"2.0","method":"start","id":1}
{"jsonrpc":"2.0","result":"","id":1}
^]
telnet> quit
```

#### Shutdown Node

```bash
$ telnet 127.0.0.1 25421
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
{"jsonrpc":"2.0","method":"shutdown","id":2}
{"jsonrpc":"2.0","result":"","id":2}
^]
telnet> quit
```

#### Send Message

```bash
$ telnet 127.0.0.1 25421
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
{"jsonrpc":"2.0","method":"send","params":{"recipient":"366a48151e16befa5ae46bd7ad8fa3d3f2dfe0cd2ee29837aa257bab9e332922","payload":"Hello World"},"id":3}
{"jsonrpc":"2.0","result":"","id":3}
^]
telnet> quit
```

#### Get Identity

```bash
$ telnet 127.0.0.1 25421
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
{"jsonrpc":"2.0","method":"identity","id":4}
{"jsonrpc":"2.0","result":{"identityKeyPair":{"secretKey":"3e6499116ba86b4884345891f3421a5a16c902247326928ce41c10ad8a66bd1f668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4","publicKey":"668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4"},"agreementKeyPair":{"secretKey":"3861685f7a54ea9c6e6eb3fdb6d0d00cffda1cda91e93dc1bfb9838fae1ef05a","publicKey":"5f63d6a50f75962a832be4236dc3e3757fad93bd19f59f40576c0596afef1d4e"},"proofOfWork":-2140756759},"id":4}
^]
telnet> quit
```

#### Get Events

```bash
$ telnet 127.0.0.1 25421
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
{"jsonrpc":"2.0","method":"events","id":5}
{"jsonrpc":"2.0","result":[{"type":"NodeUpEvent","node":{"identity":{"proofOfWork":-2140756759,"agreementKeyPair":{"publicKey":"5f63d6a50f75962a832be4236dc3e3757fad93bd19f59f40576c0596afef1d4e","secretKey":"3861685f7a54ea9c6e6eb3fdb6d0d00cffda1cda91e93dc1bfb9838fae1ef05a"},"identityKeyPair":{"publicKey":"668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4","secretKey":"3e6499116ba86b4884345891f3421a5a16c902247326928ce41c10ad8a66bd1f668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4"}},"tcpFallbackPort":0,"port":0}},{"type":"PeerDirectEvent","peer":{"address":"c0900bcfabc493d062ecd293265f571edb70b85313ba4cdda96c9f77163ba62d"}},{"type":"NodeOnlineEvent","node":{"identity":{"proofOfWork":-2140756759,"agreementKeyPair":{"publicKey":"5f63d6a50f75962a832be4236dc3e3757fad93bd19f59f40576c0596afef1d4e","secretKey":"3861685f7a54ea9c6e6eb3fdb6d0d00cffda1cda91e93dc1bfb9838fae1ef05a"},"identityKeyPair":{"publicKey":"668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4","secretKey":"3e6499116ba86b4884345891f3421a5a16c902247326928ce41c10ad8a66bd1f668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4"}},"tcpFallbackPort":0,"port":0}},{"type":"PeerDirectEvent","peer":{"address":"5b4578909bf0ad3565bb5faf843a9f68b325dd87451f6cb747e49d82f6ce5f4c"}},{"type":"PeerDirectEvent","peer":{"address":"bf3572dba7ebb6c5ccd037f3a978707b5d7c5a9b9b01b56b4b9bf059af56a4e0"}},{"type":"PeerDirectEvent","peer":{"address":"ab7a1654d463f9986530bed00569cc895697827b802153b8ef1598579713045f"}}],"id":5}
^]
telnet> quit
```

### Accessing Remote Control via `node-rc` Command

The command line interface itself implements the remote control protocol in its `node-rc` command.

You can use it like this:

```bash
$ drasyl node-rc identity
{
  "proofOfWork" : -2140756759,
  "agreementKeyPair" : {
    "publicKey" : "5f63d6a50f75962a832be4236dc3e3757fad93bd19f59f40576c0596afef1d4e",
    "secretKey" : "3861685f7a54ea9c6e6eb3fdb6d0d00cffda1cda91e93dc1bfb9838fae1ef05a"
  },
  "identityKeyPair" : {
    "publicKey" : "668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4",
    "secretKey" : "3e6499116ba86b4884345891f3421a5a16c902247326928ce41c10ad8a66bd1f668178a3be9ad22f4f6e94c835ac824cf365db86bb486ab4a42c021dec09c0e4"
  }
}
```

Run `drasyl help node-rc` to see the help for the installed remote control commands.

:::caution

The `node-rc` command can only remote control nodes started with the `--rc-jsonrpc-tcp` flag.
