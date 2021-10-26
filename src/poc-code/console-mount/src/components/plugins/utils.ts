import * as _ from 'lodash';

/** TODO: Copied right now -- duplicate definition */
const getURLSearchParams = () => {
  const all: any = {};
  const params = new URLSearchParams(window.location.search);

  for (const [k, v] of params.entries()) {
    all[k] = v;
  }

  return all;
};

export const getEnabledDynamicPluginNames = (enabledPlugins) => {
  const allPluginNames = window.SERVER_FLAGS.consolePlugins;
  const disabledPlugins = getURLSearchParams()['disable-plugins'];

  const plugins = [...allPluginNames, ...enabledPlugins];

  if (!disabledPlugins) {
    return plugins;
  }

  if (disabledPlugins === '') {
    return [];
  }

  const disabledPluginNames = _.compact(disabledPlugins.split(','));
  return plugins.filter((pluginName) => !disabledPluginNames.includes(pluginName));
};
