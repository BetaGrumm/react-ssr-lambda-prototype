import React from 'react';

const Home = (props) => {
  const { subdomain } = props;
  return (
    <h1>
      Hello test{props.name}! I'm from {subdomain || 'empty'}.
    </h1>
  );
};

export default Home;
