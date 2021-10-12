import React, { useEffect, useState } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import AsynComponent from '../../Components/AsyncComponent';
import PropTypes from 'prop-types';

const DynamicRoute = ({ location }) => {
  const [{ component, title }, setComponent] = useState({
    title: 'HAC',
  });
  useEffect(() => {
    if (location) {
      const [, , app] = location.pathname.split('/');
      fetch('/api/plugins/console-demo-plugin/plugin-manifest.json').then(
        async (data) => {
          const { extensions } = await data.json();
          const { properties: currRoute } =
            extensions.find(
              ({ type, properties }) =>
                type === 'console.page/route' && properties.path === `/${app}`
            ) || {};
          const { properties: currHref } =
            extensions.find(
              ({ type, properties }) =>
                type === 'console.navigation/href' &&
                properties.href === `/${app}`
            ) || {};
          setComponent({
            component: {
              scope: 'console-demo-plugin',
              module: currRoute?.component?.$codeRef,
              ...currRoute,
            },
            title: currHref.name,
          });
        }
      );
    }
  }, [location?.pathname]);
  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={title} />
      </PageHeader>
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
