import * as React from 'react';
import { initConsolePlugins } from '@console/dynamic-plugin-sdk/src/runtime/plugin-init';
import { /* ActivePlugin, */ PluginStore } from '@console/plugin-sdk';
import { useReduxStore } from '../../redux';
import { getEnabledDynamicPluginNames } from './utils';

type PluginProps = {
  enabledPlugins: string[],
  onPluginRegister: Function
}

const IncludePlugins = ({ enabledPlugins, onPluginRegister }: PluginProps) => {
  const store = useReduxStore();

  React.useEffect(() => {
    if (store) {
      const activePlugins = [];
        // process.env.NODE_ENV !== 'test'
        //   ? /* eslint-disable global-require, @typescript-eslint/no-require-imports */
        //     // eslint-disable-next-line import/no-unresolved
        //     (require('@console/active-plugins').default as ActivePlugin[])
        //   : [];
      const dynamicPluginNames = getEnabledDynamicPluginNames(enabledPlugins);
      const pluginStore = new PluginStore(activePlugins, dynamicPluginNames);

      initConsolePlugins(pluginStore, store, onPluginRegister);
    }
  }, [store]);

  return null;
};

export default IncludePlugins;
