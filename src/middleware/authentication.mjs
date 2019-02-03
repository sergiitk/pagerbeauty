// ------- Imports -------------------------------------------------------------

import auth from 'basic-auth';
import timingSafeCompare from 'tsscmp';

// ------- Helpers -------------------------------------------------------------

function authorizeCredentials(ctx, name, pass) {
  const credentials = auth(ctx);
  if (!credentials) {
    return false;
  }

  let valid = true;

  // Simple method to prevent short-circut and use timing-safe compare
  valid = timingSafeCompare(credentials.name, name) && valid;
  valid = timingSafeCompare(credentials.pass, pass) && valid;

  return valid;
}

function authorizeAccessToken(ctx, tokenExpected) {
  const { request } = ctx;
  const { body, query } = request;

  if (!tokenExpected) {
    return false;
  }

  let count = 0;
  let tokenCandidate = false;

  // Query string: access_token
  if (query && query.access_token) {
    tokenCandidate = query.access_token;
    count += 1;
  }

  // Authorization: Bearer token
  const authHeader = request.get('authorization');
  if (authHeader) {
    // Split the value of the header.
    const [authType, authCredentials, ...rest] = authHeader.split(' ');
    // Must be exactly two.
    if (authType === 'bearer' && authCredentials && !rest.length) {
      tokenCandidate = authCredentials;
      count += 1;
    }
  }

  // Body: access_token
  if (body && body.access_token) {
    tokenCandidate = body.access_token;
    count += 1;
  }

  if (!tokenCandidate) {
    return false;
  }

  ctx.assert(count === 1, 400, 'Only one access token must be given');
  return timingSafeCompare(tokenCandidate, tokenExpected);
}

// ------- Authentication middleware -------------------------------------------

export function authentication(name, pass, token, opts = {}) {
  const realm = opts.realm || 'Secure Area';

  if (!name) {
    throw new Error('Basic auth `name` is required');
  }

  return async (ctx, next) => {
    const tokenAuthPass = authorizeAccessToken(ctx, token);
    const credentialsPass = authorizeCredentials(ctx, name, pass);

    ctx.assert(tokenAuthPass || credentialsPass, 401, null, {
      headers: {
        'WWW-Authenticate': `Basic realm="${realm.replace(/"/g, '\\"')}"`,
      },
    });
    await next();
  };
}

// ------- End -----------------------------------------------------------------
