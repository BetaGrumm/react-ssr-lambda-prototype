// You'll notice the mix of commonjs and ES6.
// When I started out I needed to use commonjs as ES6 is not supported in a nodejs environment.
// After much effort and many different webpack solutions, I arrived at the serverless-bundle
// package with is a self contained and sufficent webpack bundling solution which allows the use
// of full ES6 in this file. The bits of ES6 you see are just proving the point. I didn't bother to
// convert everything.
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../src/App';
const fs = require('fs');
const serverless = require('serverless-http');
const express = require('express');
const app = express();

// This will handle any request that comes in matching a file in the ./build folder which contains all
// the built assests.
app.use(express.static('./build'));
// If the requested file doesn't match anything in the build folder, then this handler will grab it,
// and return the index.html with a static render of the App component.
app.get('*', (req, res) => {
  console.log('req', req.query);
  const indexFile = path.resolve('./build/index.html');
  const html = ReactDOMServer.renderToString(<App params={req.query} />);
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }
    const document = data.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );
    return res.send(document);
    // return res.send(html); # I left this here for record, as a reminder that it is possible to
    // just return the static render of the Component and not include the index.html.
    // This bypasses the ReactDOM.hydrate() seen in index.js.
  });
});

// This guy is interetsting, but necessary.
// This is yet another part of strangly poor communication between nginx, serverless-http, and express.
// Essentially when you request localhost, the endpoint / is stripped and express can't do anything with it as it doesn't have any kind of path.
// Path and url end up being null which means express can't even begin to handle the request. This function patches / back into the url
// so that express can do its job.
function appWrapper(req, res) {
  // console.log('req ', req);
  if (!req.url) {
    req.url = '/';
    req.path = '/';
  }
  return app(req, res);
}

// Here is the serverless magic. Instead of the default expressjs app.listen(), we are using a package
// called serverless-http which esentially wraps our express app in a Lambda context. It will pass in the request
// as express expects it, and it will handle the return from express and turn it into a return/callback for the lambda.
// The additional binary bit goes along with the serverless-apigw-binary package and tells the api gatway
// which mimetypes to configure for passing through. This was neessary for the server to respond with a png file. Otherwise it was blocked.
export const server = serverless(appWrapper, {
  binary: [
    'application/javascript',
    'application/json',
    'application/octet-stream',
    'application/xml',
    'font/eot',
    'font/opentype',
    'font/otf',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'text/comma-separated-values',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/text',
    'text/xml',
  ],
});
