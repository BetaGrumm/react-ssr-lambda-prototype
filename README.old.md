# react-ssr-lambda-prototype

This is a prototype of a react app with server-side rendering, deployed in AWS Lambda, and ensuring that all API calls happen prior to app load.

Create react app and basic server-side rendering tutorial: https://www.digitalocean.com/community/tutorials/react-server-side-rendering

I made a few modifications.

- I removed the static versions from all the npm modules installed.
- Added a .env with BROWSER=none to prevent react build from opening a new browser tab every time a change is made.

CONCLUSION: SSR reacts apps are not yet ready for lambda. The main blocker is the ability to have consistent dev environments vs deployments.
This is largely due to the fact that in order to work in Lambda, the API Gateway endpoint must have a custom domain
