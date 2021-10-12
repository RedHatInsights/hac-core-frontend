export default async ({ dynamicNav, currentNamespace }) => {
  const [appId, navSection] = dynamicNav.split('/');
  const { extensions } =
    (await (
      await fetch('/api/plugins/console-demo-plugin/plugin-manifest.json')
    )?.json()) || {};
  const routes = extensions
    .filter(
      ({ type, properties }) =>
        type.includes('console.navigation') && properties.section === navSection
    )
    .map((item) => ({
      appId,
      href: `/${currentNamespace}/${navSection}${item.properties.href}`,
      title: item.properties.name,
    }));
  return {
    expandable: true,
    routes,
  };
};
