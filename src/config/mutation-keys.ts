export const mutationKeys = {
  contract: {
    base: "contract",
    add: () => [`${mutationKeys.contract.base}`, "add"],
    updateStatus: () => [`${mutationKeys.contract.base}`, "update-status"],
  },
  bills: {
    base: "bills",
    delete: () => [`${mutationKeys.bills.base}`, "delete"],
  },
};
