export const getParams = (pathname: string) => {
  return pathname.split("/").filter(Boolean);
};
