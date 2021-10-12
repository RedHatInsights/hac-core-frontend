import React, { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import './App.scss';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { injectScript } from '@scalprum/core';
import { ModuleContext } from './Utils/AsyncModules';

const App: React.FC = () => {
  const history = useHistory();
  const { activePlugins } = useContext(ModuleContext);

  useEffect(() => {
    activePlugins.forEach((item) =>
      injectScript(item, `/api/plugins/${item}/plugin-entry.js`)
    );
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
    <Fragment>
      <NotificationsPortal />
      <Routes />
    </Fragment>
  );
};

export default App;
