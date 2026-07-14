import { shipnode } from '@devalade/shipnode';
import { homedir } from 'node:os';
import { join } from 'node:path';

// DATABASE_URL / REDIS_URL come from .env, loaded into process.env by
// shipnode's own loader before this file is evaluated — see
// node_modules/@devalade/shipnode/dist/config/loader.js (loadEnvIntoProcess).
// Never hardcode credentials here: this file is committed to git.
const db = new URL(process.env.DATABASE_URL!);
const redis = new URL(process.env.REDIS_URL!);

export default shipnode
  .backend()
  .ssh({
    host: '8.222.210.139',
    port: 22,
    user: 'deploy',
    // Unset in CI: connection.js does readFileSync(identityFile) unconditionally when
    // it's set, with no existsSync check and no fallback to SSH_AUTH_SOCK — so a
    // hardcoded path here breaks webfactory/ssh-agent-based CI runs (see journal Bug #7).
    identityFile: process.env.CI
      ? undefined
      : join(homedir(), '.ssh/adoptionlog'),
  })
  .deployTo('/var/www/nest-api')
  .pm2('nest-api', { instances: 1 })
  .port(3001)
  .domain('nest-shipnode.adoptionlog.theid.dev')
  .healthCheck('/health')
  .nodeVersion('22')
  .pkgManager('npm')
  // Monorepo: rsync only ships this app's subdirectory, which has no
  // package-lock.json of its own since npm workspaces centralizes it at the
  // repo root. The default `npm ci` requires a matching lockfile and fails
  // remotely with EUSAGE — `npm install` resolves fresh instead.
  .installCommand('npm install')
  .keepReleases(2)
  // v3 blue-green: alt port must not collide with another app on the same
  // VPS — 3001 (web) / 3002 is already express-api's port, so pick 3011.
  .zeroDowntime(3011)
  .database({
    type: 'postgres',
    host: db.hostname,
    port: Number(db.port),
    name: db.pathname.slice(1),
    user: db.username,
    password: db.password,
  })
  .redis({
    host: redis.hostname,
    port: Number(redis.port),
    password: redis.password || undefined,
  })
  .preDeploy(async (ctx) => {
    await ctx.exec('npm run migration:run');
  })
  .build();
