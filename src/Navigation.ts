import { activePlugins } from './Utils/constants';

const getAllExtensions = async () => {
  return (
    await Promise.all(
      activePlugins.flatMap(async (pluginName) => {
        const { extensions } = (await (await fetch(`/api/plugins/${pluginName}/plugin-manifest.json`))?.json()) || {};
        return extensions;
      }),
    )
  ).flat();
};

const claculateRoutes = ([appId, navSection], currentNamespace, extensions) => {
  return extensions
    .filter(({ type, properties }) => type.includes('console.navigation/href') && properties.section === navSection)
    .map((extension) => ({
      appId,
      href: `/${currentNamespace}${navSection ? `/${navSection}` : ''}${extension.properties.href}`,
      title: extension.properties.name,
    }));
};

export default async ({ dynamicNav, currentNamespace }) => {
  const [appId, navSection] = dynamicNav.split('/');
  const allExtensions = await getAllExtensions();
  const routes = claculateRoutes([appId, navSection], currentNamespace, allExtensions);
  const { properties: currSection } =
    allExtensions.find(({ type, properties }) => type === 'console.navigation/section' && properties.id === navSection) || {};
  return navSection
    ? {
        expandable: true,
        title: currSection.name,
        routes,
      }
    : routes;
};
