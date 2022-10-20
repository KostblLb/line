window.globalResources = {};

export const configureGlobalResources = async (
  resources: Array<Record<string, () => Promise<any>>>
) => {
  for (let entry of resources) {
    for (let k of Object.keys(entry)) {
      try {
        const resolvedResource = await entry[k]();
        window.globalResources[k] = resolvedResource;
      } catch (ex) {
        console.log(ex);
      }
    }
  }
};
