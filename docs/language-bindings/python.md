# Python Package

We provide a Python binding of our [Native Shared C Library](./c.md), allowing you to use drasyl in a Pythonic as possible.

## Installation

We provide our binding as a [Python package hosted on Python Package Index](https://pypi.org/project/drasyl/). Therefore you can install it simply by running the following command:

```python
pip install drasyl
```

## Usage

First, we have to initialize a drasyl node and then retrieve the node's identity (please refer to the [Getting Started](../getting-started.md) section first, if you're new to working with our `DrasylNode`):

```python title="main.py"
from drasyl import *
import time

# highlight-start
def on_event(event):
    # code

drasyl_node_init("my-node.conf", on_event)

identity = drasyl_node_identity()
print("My address: %s" % identity.identity_public_key)
# highlight-end
```

It is now time to start the node, wait for it to come online, and then send a message to a peer (keep in mind that you need to adjust the recipient address to a running node. Otherwise, the send will fail):

```python title="main.py"
from drasyl import *
import time

# code

# highlight-start
drasyl_node_start()

print("Wait for node to become online...")
while not drasyl_node_is_online():
    time.sleep(0.05)

recipient = "78483253e5dbbe8f401dd1bd1ef0b6f1830c46e411f611dc93a664c1e44cc054".encode("UTF-8")
payload = "hello there".encode("UTF-8")
drasyl_node_send(recipient, payload)
# highlight-end
```

If the node is no longer needed, it can be shut down. Finally, we need to shut down all threads implicitly spawned by drasyl and tear down the isolate:

```python title="main.py"
from drasyl import *
import time

# code

# highlight-start
drasyl_node_stop()
drasyl_shutdown_event_loop()
thread_tear_down()
# highlight-end
```

## Reference

### drasyl_node_version

`def drasyl_node_version()`

Returns the version of the drasyl node currently loaded.

### drasyl_set_logger

`def drasyl_set_logger(logger)`

Sets logger callback function.

#### Parameters
* `logger`: Must have the following signature: `def console_logger(level, time, message)`.

### drasyl_node_init

`def drasyl_node_init(config, listener)`

Creates a new [`DrasylNode`](https://api.drasyl.org/v0.9/org/drasyl/node/DrasylNode.html).

#### Parameters
* `config`: File path to a [node configuration](../configuration/overview#use-applicationconf-file). Set to `None` to use default configuration.
* `listener`: Callback function for node events. Must have the following signature: `def on_event(event)`.

### drasyl_node_identity

`def drasyl_node_identity()`

Returns the node identity.
Must be called after `drasyl_node_init`.

### drasyl_node_start

`def drasyl_node_start()`

Starts the node.
Must be called after `drasyl_node_init`.

### drasyl_node_stop

`def drasyl_node_stop()`

Stops the node.
Must be called after `drasyl_node_init`.

### drasyl_node_send

`def drasyl_node_send(recipient, payload)`

Sends a message `payload` to `recipient`.

#### Parameters
* `recipient`: The recipient as 64 hex characters long drasyl address.
* `payload`: The payload to sent.

### drasyl_node_is_online

`def drasyl_node_is_online()`

Returns `True` if the node is currently online. Otherwise, `False` is returned.
Must be called after `drasyl_node_init`.

### drasyl_shutdown_event_loop

`def drasyl_shutdown_event_loop()`

Shutdown all (if any) threads implicitly created that are used by the drasyl node.
This operation cannot be undone. After performing this operation, now new node can be started!

## Example

A fully functional example can be found in our [GitHub Repository](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/examples/python/example.py).