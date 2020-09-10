import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// The other part of React SSR, Hydrate as per my understanding is called after the static assets
// are delivered and attaches all the react handlers on to the markup using a shadow dom.
// This allows all the interactive parts of react to still work.
// The biggest issue here, was that as you can see, it's hydrating App but doesn't know anything about
// props from the server. This means that while my initial render from the server contained props from the server,
// Hydrate would come along and rerender in the shadow dom, and then detect a difference in the redered output,
// and replace it with app sans props. Which just stomps all over my app.
// This is as far as I got, I still have not figured out how to persist server data in the app.
ReactDOM.hydrate(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
