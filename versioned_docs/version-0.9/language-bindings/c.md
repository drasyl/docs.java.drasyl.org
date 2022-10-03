# Native Shared C Library

Using the [GraalVM](https://www.graalvm.org/dev/reference-manual/native-image/guides/build-native-shared-library/), we can provide a native shared library called libdrasyl that allows you to run a drasyl node with plain C without needing a Java Virtual Machine.

`libdrasyl` is deployed as a platform-specific build for the following architectures:
 * Linux
    * x64
    * arm64
 * macOS
    * x64
    * aarch64
 * Windows
    * x64

## Installation

You can grab the latest `libdrasyl.so`, `libdrasyl.dylib`, or `libdrasyl.dll` alongside with the header files `drasyl.h`, `libdrasyl.h`, and `graal_isolate.h` from our [GitHub releases page](https://github.com/drasyl-overlay/drasyl/releases/latest).
For our Linux and macOS users, we suggest installing `libdrasyl` through [Homebrew](https://brew.sh/):

```bash
brew install drasyl-overlay/tap/libdrasyl
```

## Usage

Include the `drasyl.h` and `libdrasyl.h` files in your project and link it against `drasyl`.

With the library setup, `libdrasyl` can then be used by first creating an isolate allowing you to attach threads from C code (more information abouth this can be found [here](https://www.graalvm.org/dev/reference-manual/native-image/native-code-interoperability/C-API/)):

```c title="main.c"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "drasyl.h"
#include "libdrasyl.h"

int main() {
	// highlight-start
    graal_isolate_t *isolate = NULL;
    graal_isolatethread_t *thread = NULL;

    if (graal_create_isolate(NULL, &isolate, &thread) != 0) {
        return DRASYL_ERROR_GENERAL;
    }
    // highlight-end

    return DRASYL_SUCCESS;
}

```

After creating the isolate, we can use it to initialize a drasyl node and then retrieve the node's identity (please refer to the [Getting Started](../getting-started.md) section first if you're new to working with our `DrasylNode`):

```c title="main.c"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "drasyl.h"
#include "libdrasyl.h"

// highlight-start
void on_drasyl_event(graal_isolatethread_t* thread, drasyl_event_t* event) {
    /* code */
}
// highlight-end

int main() {
    /* code */

	// highlight-start
    char config[] = "my-node.conf";
    if (drasyl_node_init(thread, config, sizeof(config), &on_drasyl_event) != DRASYL_SUCCESS) {
        fprintf(stderr, "could not init node\n");
        return DRASYL_ERROR_GENERAL;
    }

    drasyl_identity_t *identity = calloc(1, sizeof(drasyl_identity_t));
    if (drasyl_node_identity(thread, identity) != DRASYL_SUCCESS) {
        fprintf(stderr, "could not retrieve node identity\n");
        return DRASYL_ERROR_GENERAL;
    }
    printf("My address: %.64s\n", identity->identity_public_key);
    // highlight-end

    return DRASYL_SUCCESS;
}
```

It is now time to start the node, wait for it to come online, and then send a message to a peer (keep in mind that you need to adjust the recipient address to a running node. Otherwise, the send will fail):

```c title="main.c"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "drasyl.h"
#include "libdrasyl.h"

/* code */

int main() {
    /* code */

	// highlight-start
    if (drasyl_node_start(thread) != DRASYL_SUCCESS) {
        fprintf(stderr, "could not start node\n");
        return DRASYL_ERROR_GENERAL;
    }

    printf("Wait for node to become online...\n");
    while (!drasyl_node_is_online(thread)) {
        drasyl_sleep(thread, 50);
    }

    char recipient[] = "78483253e5dbbe8f401dd1bd1ef0b6f1830c46e411f611dc93a664c1e44cc054";
    char payload[] = "hello there";
    if (drasyl_node_send(thread, recipient, payload, sizeof(payload)) != DRASYL_SUCCESS) {
        fprintf(stderr, "could not send message\n");
        return DRASYL_ERROR_GENERAL;
    }
    // highlight-end

    return DRASYL_SUCCESS;
}
```

If the node is no longer needed, it can be shutdown. Finally, we need to shutdown all threads implicitly spawned by drasyl and tear down the isolate:

```c title="main.c"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "drasyl.h"
#include "libdrasyl.h"

/* code */

int main() {
    /* code */

	// highlight-start
    if (drasyl_node_stop(thread) != DRASYL_SUCCESS) {
        fprintf(stderr, "could not stop node\n");
        return DRASYL_ERROR_GENERAL;
    }

    if (drasyl_shutdown_event_loop(thread) != DRASYL_SUCCESS) {
        fprintf(stderr, "could not shutdown event loop\n");
        graal_tear_down_isolate(thread);
        return DRASYL_ERROR_GENERAL;
    }

    graal_tear_down_isolate(thread);
    // highlight-end

    return DRASYL_SUCCESS;
}
```

## Reference

Reference information about the typedefs declared by the `drasyl.h` header file is provided within the file (you can also refer [here](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h)).

The functions defined by `libdrasyl.h` are mainly one-to-one bindings to the according Java-Methods of the [`DrasylNode`](https://api.drasyl.org/v0.9/org/drasyl/node/DrasylNode.html) Java class.

### drasyl_node_version

`int drasyl_node_version(graal_isolatethread_t* thread)`

Returns the version of the drasyl node currently loaded.
Most four significant bytes represent the major version.
The following four bytes represent the minor version and are followed by another four bytes representing the patch version. The least significant four bytes are unused.
If the version could not be retrieved, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

### drasyl_set_logger

`int drasyl_set_logger(graal_isolatethread_t* thread, void * logger)`

Sets logger callback function.
If the logger could not be set, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

#### Parameters
* `logger`: Must have the following signature: `void (graal_isolatethread_t* thread, int level, unsigned long time, char* message)`.

### drasyl_node_init

`int drasyl_node_init(graal_isolatethread_t* thread, char* config, size_t config_len, void * listener)`

Creates a new [`DrasylNode`](https://api.drasyl.org/v0.9/org/drasyl/node/DrasylNode.html).
If the node could not be created, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

#### Parameters
* `config`: File path to a [node configuration](../configuration/overview#use-applicationconf-file). Set to `NULL` to use default configuration.
* `config_len`: The length of the node configuration file path. Set to `0` to use default configuration.
* `listener`: Callback function for node events. Must have the following signature: `void on_drasyl_event(graal_isolatethread_t* thread, drasyl_event_t* event)`.

### drasyl_node_identity

`int drasyl_node_identity(graal_isolatethread_t* thread, drasyl_identity_t*)`

Returns the node identity.
Must be called after `drasyl_node_init`.
If the identity could not be retrieved, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

### drasyl_node_start

`int drasyl_node_start(graal_isolatethread_t* thread)`

Starts the node.
Must be called after `drasyl_node_init`.
If the node could not be started, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

### drasyl_node_stop

`int drasyl_node_stop(graal_isolatethread_t* thread)`

Stops the node.
Must be called after `drasyl_node_init`.
If the node could not be stopped, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

### drasyl_node_send

`int drasyl_node_send(graal_isolatethread_t* thread, char* recipient, char* payload, size_t payload_len)`

Sends a message `payload` to `recipient`.
Must be called after `drasyl_node_init`.
If the recipient does not acknowledge the receival of the message, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

#### Parameters
* `recipient`: The recipient as 64 hex characters long drasyl address.
* `payload`: The payload to be sent.
* `payload_len`: The length of the payload.

### drasyl_node_is_online

`int drasyl_node_is_online(graal_isolatethread_t* thread)`

Returns `1` if the node is currently online. Otherwise, `0` is returned.
Must be called after `drasyl_node_init`.

### drasyl_sleep

`void drasyl_sleep(graal_isolatethread_t* thread, long long int millis)`

Causes the currently executing thread to sleep for the specified number of milliseconds.

### drasyl_shutdown_event_loop

`int drasyl_shutdown_event_loop(graal_isolatethread_t* thread)`

Shutdown all (if any) threads implicity created that are used by the drasyl node.
This operation cannot be undone. After performing this operation, now new node can be started!
If the threads could not be shut down, this function returns [`DRASYL_ERROR_GENERAL`](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/src/main/c/drasyl.h).

## Example

A fully functional example can be found in our [GitHub Repository](https://github.com/drasyl-overlay/drasyl/blob/master/drasyl-shared-library/examples/c/example.c).
