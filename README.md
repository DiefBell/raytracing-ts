Start the server with `cd server && bun start`. It still runs on Node, not Bun, because I couldn't set up a websocket server with Bun (not sure it's even doable yet?)

Start the client afterwards with `cd client && yarn start`. This has to be done after the server and you'll need to restart the server whenever the React dev server restarts. It should find the server and load the image no problem.

In the server folder, you can manually benchmark the render with `bun benchmark:bun` and `bun benchmark:node`.