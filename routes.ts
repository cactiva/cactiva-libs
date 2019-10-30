function importAllRoute(r, except) {
  const routes = {};
  r.keys().map(name => {
    const finalName = name.substr(2, name.length - 6);
    let skip = false;
    except.map(ex => {
      if (finalName.indexOf(ex) > -1) skip = true;
    });
    if (skip) return;
    routes[finalName] = {
      screen: r(name).default,
      path: finalName
    };
  });
  return routes;
}
export const routes = (except?: string[]) =>
  importAllRoute(require.context("../", true, /\.(tsx)$/), except);
