/*
 * Redirect middleware
 */

export function redirect(url, status = 302) {
  return async (ctx, next) => {
    ctx.status = status;
    ctx.redirect(url);
    await next();
  };
}
