export const matationKey = {
  contract: {
    base: "contract",
    add: () => [`${matationKey.contract.base}`, "add"],
    updateStatus: () => [`${matationKey.contract.base}`, "update-status"],
  },
};
