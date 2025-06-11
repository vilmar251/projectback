// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logRoutes = (server: any) => {
  try {
    if (!server._router) {
      console.log('\nAPI маршруты:');
      console.log('Маршруты управляются Inversify, подробная информация доступна при запуске сервера.');
      console.log();
      return;
    }

    const globalHandlers = server._router.stack;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalHandlers.forEach((globalHandler: any) => {
      if (globalHandler.name === 'router') {
        const globalPath = split(globalHandler.regexp);
        const path = Array.isArray(globalPath) ? globalPath.filter(Boolean).join('/') : '';

        if (globalHandler.handle && globalHandler.handle.stack) {
          const nestedHandlers = globalHandler.handle.stack;

          console.log(`== ${path.toUpperCase()} ==`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nestedHandlers.forEach((nestedHandler: any) => {
            if (nestedHandler.route) {
              const { methods, path: routePath } = nestedHandler.route;

              const method = Object.keys(methods)[0].toUpperCase();

              const tabSize = 8;
              const spaces = tabSize - method.length;
              console.log(`${method}:${' '.repeat(spaces)}/${path}${routePath}`);
            }
          });
        }
      }
    });

    console.log();
  } catch (error) {
    console.log('\nНе удалось отобразить маршруты:', error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const split = (path: any) => {
  if (typeof path === 'string') {
    return path.split('/');
  }

  if (path.fast_slash) {
    return '';
  }

  const match = path
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);

  return match ? match[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + path.toString() + '>';
};
