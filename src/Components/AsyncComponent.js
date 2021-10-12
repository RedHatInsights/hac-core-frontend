import React, { Fragment } from 'react';
import { useModule } from '../Utils/AsyncModules';
import PropTypes from 'prop-types';

const AsynComponent = ({ scope, module = '', ...props }) => {
  const [currModule, exported = 'default'] = module.split('.');
  const loadedModule = useModule(scope, currModule);

  const Component = loadedModule && loadedModule[exported];
  return Component ? <Component {...props} /> : <Fragment />;
};

AsynComponent.propTypes = {
  scope: PropTypes.string,
  module: PropTypes.string,
};

export default AsynComponent;
