import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import './App.scss';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { ModuleContext } from './Utils/AsyncModules';

type AppProps = {
  currModules: any,
  activePlugins: any
}

const App: React.FC<AppProps> = ({ currModules, activePlugins }) => {
  const history = useHistory();
  const [activeModules, setActiveModules] = React.useState();

  React.useEffect(() => {
    setActiveModules(currModules);
  }, [currModules])

  React.useEffect(() => {
    const registry = getRegistry();
    registry.register({ notifications: notificationsReducer });
    window.insights?.chrome?.init();

    window.insights?.chrome.identifyApp('hac');
    const unregister = window.insights?.chrome.on('APP_NAVIGATION', (event) => {
      if (event.domEvent) {
        history.push(`${event.domEvent.href.replace('/hac', '')}`);
      }
    });
    return () => {
      unregister();
    };
  }, []);

  return (
    <ModuleContext.Provider
      value={{
        activeModules,
        activePlugins,
      }}
    >
        <NotificationsPortal />
        <Routes />
    </ModuleContext.Provider>
  );
};

export default App;
