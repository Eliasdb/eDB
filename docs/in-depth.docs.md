## Under the Hood

### Client-Server Interaction

Below you see a visual representation of the request-response model. Also mentioned protocols used and general information about headers.
![Client-Server Interaction Diagram](./docs/client-server.drawio.png)

### Critical Rendering Path (CRP)

Illustrated roughly what's going on in the CRP in a framework-agnostic way. The CRP is responsible for turning HTML, CSS, and JavaScript into pixels on the screen.

-   Parsing HTML → DOM (Document Object Model)
-   Parsing CSS → CSSOM (CSS Object Model)
-   Executing JavaScript (which may modify the DOM and CSSOM)
-   Creating the Render Tree (DOM + CSSOM)
-   Layout Calculation (determining positions and sizes)
-   Painting (filling pixels)
-   Compositing (layering elements for final rendering)

![Critical Rendering Path](./docs/crp.drawio.png)

### The Event Loop

The event loop is the mechanism that JavaScript uses to handle asynchronous operations efficiently, ensuring that the single-threaded JavaScript runtime remains non-blocking.

![The Event Loop](./docs/event-loop.png)
