window.globalResources = {};

export const configureGlobalResources = (
  resources: Record<string, () => Promise<any>>
) => {
  Object.keys(resources).forEach(async (k) => {
    try {
      const resolvedResource = await resources[k]();
      window.globalResources[k] = resolvedResource;
    } catch (ex) {
      console.log(ex);
    }
  });
};
