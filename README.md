# Description

This repo contains reserach work done to figure out how to build a react app with server-side
rendering using CRA and a vanilla express setup. On top of that, I desired to have it deploy to and
run in an AWS Lambda environment.
Compiled in this readme are reserach notes, sticking points, and issues left undevloped as well
as a summary and notes to run what is here.

See comments in individual code files for specific details.

# To Run This Prototype

This prototype should function locally.

### Requirements:

- Nodejs 8.x +
- docker

### To start:

All start up commands are wrapped into the package.json.

- Install packages: `npm i`
- Build assets and start serverless-offline: `npm run dev:start`
- Finally, in a separate terminal, start the nginx proxy server: `npm run dev:docker`

# Developer Notes

This was an excellent exercise in a slightly new area of our stack. While we already use React,
AWS Lambda, and expressjs, we have never used them in conjuction like this.
New tech attempted in this prototype:

- React Server-side rendering
- Expressjs as a frontend webserver
- Expressjs in a lambda context
- ES6 in a nodejs context (extra webpack considerations)

This conbination of things presented many challenges which are not well documented as they aren't standard
combinations.
ES6 in nodejs environment was probably the most documented, and the greatest pain to debug and get working.
Running expressjs in a lambda context requires some wrapping which, while it in itself is not complex (it was actually quite simple) it was
just one more variable in the webpack mix.
Another angle of complexity with express and the lambda wrapper was getting requests to come through properly.
API gateway always adds a stage variable on the url to the lambda, which created issues when trying to serve static assets.
For local development, I had to create an nginx proxy to effectively proxy the request in the right format to the
underlying serverless endpoint. The communication between the proxy, serverless-offline, serverless-http (the express wrapper) and express itself
is a bit of a mystery and did not work out of the box. THere was quite a bit of trial and error to come up with a way for the request to through
in an expected and usable manner, and even then not in the manner I desired. See server/index.js and the nginx.conf file for comments and some details.
Ultimately I surrendered the idea of a simple / endpoint and had to use an actual value endpoint as I
was unable to correctly pass through / as an endpoint. instead I used something like /widget to get it to be passed through as a url value and
be recognized by express.

The second great hurdle, was the combination of react code required for a Server-side render configuraiton
is all in ES6 by necessity, but required to run in a node context by necessity. This requires a webpack bundle
which after much trial and erorr, I happened to find a serverelss-package which worked without any need for a webpack config.
In the end I did realize my config errors for the manual babel setup, but chose to stick with the config less option
for simplicity.

The third and final problem still remains.
When you start up the app, and try to hit it with a query string parameter: http://localhost/widget?subdomain=testsite
you will see for the briefest moment "Hello testMicah! I'm from testsite." before the page refreshes and testsite becomes empty.

This issue was never overcome. The problem is that while I can parse the parameter testsite on the server and pass it to the App component
for render and response, the ReactDOM.hydrate() fuction rerenders the page with App sans any props. I never was able to figure out how
to provide the server props to the hydrate function, thus any server data is not persisted.

And there we are.
