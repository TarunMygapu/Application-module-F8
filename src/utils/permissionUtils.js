export const checkAccess = (permissions, screenKey) => {
  const level = permissions?.[screenKey];
  return {
    canView: level === "v" || level === "all",
    isFullAccess: level === "all",
  };
};


export const checkRole = (roles = [], targetRole) => {
  if (!Array.isArray(roles) || !targetRole) return false;
  return roles.includes(targetRole);
};

