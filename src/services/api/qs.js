export default (params) => {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .filter(k => params[k] !== undefined)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&');
};
