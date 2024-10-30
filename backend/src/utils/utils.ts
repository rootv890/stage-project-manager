export const usernamePatternChecker = (username: string) => {
  const usernamePattern = /^[a-z0-9-_]+$/;

  if (!usernamePattern.test(username)) {
    return false;
  }

  return true;
};
