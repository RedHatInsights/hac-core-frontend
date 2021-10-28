import * as React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useExtensions } from '@console/plugin-sdk/src';
import {
  isRoutePage as isDynamicRoutePage,
  RoutePage as DynamicRoutePage,
} from '@console/dynamic-plugin-sdk';

const Loader = () => <Bullseye><Spinner /></Bullseye>;

type DynamicRouteProps = {
  location?: Location
};

const DynamicRoute: React.FC<DynamicRouteProps> = ({ location }) => {
  const [Component, setComponent] = React.useState<React.ExoticComponent<any>>(React.Fragment);
  const dynamicRoutePages = useExtensions<DynamicRoutePage>(isDynamicRoutePage);
  React.useEffect(() => {
    if (location) {
      const [, , app] = location.pathname?.split('/') || [];
      if (app) {
        const { properties: currRoute } = dynamicRoutePages.find(({ properties }) => properties.path === `/${app}`) || {};
        if (currRoute) {
          setComponent(() => React.lazy(async () => ({
            default: (await currRoute.component()) || Loader
          })));
        }
      }
    }
  }, [location?.pathname, dynamicRoutePages]);

  return (
    <React.Fragment>
      <Main>
        {Component ? (
          <React.Suspense fallback={null}>
            <Component />
          </React.Suspense>
        ) : (
          <Bullseye>
            <Spinner />
          </Bullseye>
        )}
      </Main>
    </React.Fragment>
  );
};

export default DynamicRoute;
