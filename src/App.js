import React from 'react';
import Home from './pages/Home';

const App = (props) => {
  console.log('props', props);
  const { subdomain } = props.hasOwnProperty('params') && props.params;
  console.log('subdomain', subdomain);
  return <Home name="Micah" subdomain={subdomain} />;
};

export default App;
