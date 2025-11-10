const React = require('react');

function createStackNavigator() {
  const Navigator = ({ children }) => React.createElement('div', {}, children);
  const Screen = ({ children }) => React.createElement('div', {}, children);
  return { Navigator, Screen };
}

module.exports = { createStackNavigator };
