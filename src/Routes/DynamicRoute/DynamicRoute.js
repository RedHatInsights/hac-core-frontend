import React, { useContext, useEffect, useState } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import AsynComponent from '../../Components/AsyncComponent';
import PropTypes from 'prop-types';
import { ModuleContext } from '../../Utils/AsyncModules';

const DynamicRoute = ({ location }) => {
  const [component, setComponent] = useState({
    title: 'HAC',
  });
  const { activePlugins } = useContext(ModuleContext);
  useEffect(() => {
    if (location) {
      const [, , app] = location.pathname.split('/');
      activePlugins.forEach((item) => {
        fetch(`/api/plugins/${item}/plugin-manifest.json`).then(
          async (data) => {
            const { extensions } = await data.json();
            const { properties: currRoute } =
              extensions.find(
                ({ type, properties }) =>
                  type === 'console.page/route' && properties.path === `/${app}`
              ) || {};
            if (currRoute) {
              setComponent({
                scope: item,
                module: currRoute?.component?.$codeRef,
                ...currRoute,
              });
            }
          }
        );
      });
    }
  }, [location?.pathname]);
  return (
    <React.Fragment>
      <Main>
        {component ? (
          <AsynComponent {...component} />
        ) : (
          <Bullseye>
            <Spinner />
          </Bullseye>
        )}
      </Main>
    </React.Fragment>
  );
};

DynamicRoute.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default DynamicRoute;
