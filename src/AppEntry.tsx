import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import logger from 'redux-logger';
import { ModuleContext } from './Utils/AsyncModules';
import { activePlugins } from './Utils/constants';
let moduleMap = {};

window.loadPluginEntry = (scopeName, container) => {
  moduleMap[scopeName] = container;
  document.dispatchEvent(
    new CustomEvent('pluginChanged', { detail: { container, scopeName } })
  );
};

const AppEntry = () => {
  const [activeModules, setActiveModules] = useState({});
  useEffect(() => {
    const handleListen = ({ detail }: CustomEvent) => {
      setActiveModules((prevModules) => ({
        ...prevModules,
        [detail.scopeName.split('@')?.[0]]: detail.container,
      }));
    };
    document.addEventListener('pluginChanged', handleListen);
    () => {
      document.removeEventListener('pluginChanged', handleListen);
    };
  }, []);
  return (
    <ModuleContext.Provider
      value={{
        activeModules,
        activePlugins,
      }}
    >
      <Provider
        store={init(
          process.env.NODE_ENV !== 'production' ? logger : []
        ).getStore()}
      >
        <Router basename={getBaseName(window.location.pathname, 1)}>
          <App />
        </Router>
      </Provider>
    </ModuleContext.Provider>
  );
};

export default AppEntry;
