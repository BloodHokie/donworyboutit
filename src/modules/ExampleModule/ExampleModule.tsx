import React from 'react';

const ExampleModule = React.memo(() => {
  return <div style={{ width: 100, height: 200, backgroundColor: 'red' }} />;
});

export default ExampleModule;
