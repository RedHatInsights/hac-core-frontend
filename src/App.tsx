import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import './App.scss';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

import { ModuleContext } from './Utils/AsyncModules';
import { loadDynamicPlugin } from '@console/dynamic-plugin-sdk/src/runtime/plugin-loader';

const App: React.FC = () => {
  const history = useHistory();
  const { activePlugins } = React.useContext(ModuleContext);

  React.useEffect(() => {
    activePlugins.forEach(async (item) => {
      const manifest = await (await fetch(`/api/plugins/${item}/plugin-manifest.json`)).json();
      console.log(manifest, 'this is manifest');
      loadDynamicPlugin(`/api/plugins/${item}/`, manifest);
    }
      // injectScript(item, `/api/plugins/${item}/plugin-entry.js`)
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
    <React.Fragment>
      <NotificationsPortal />
      <Routes />
    </React.Fragment>
  );
};

export default App;
