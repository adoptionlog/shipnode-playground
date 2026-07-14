import { shipnode } from '@devalade/shipnode';
import { homedir } from 'node:os';
import { join } from 'node:path';

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
  .deployTo('/var/www/next-app')
  .pm2('next-app', { instances: 1 })
  .port(3003)
  .domain('next-shipnode.adoptionlog.theid.dev')
  .healthCheck('/api/health')
  .nodeVersion('22')
  .pkgManager('npm')
  // Monorepo: rsync only ships this app's subdirectory, which has no
  // package-lock.json of its own since npm workspaces centralizes it at the
  // repo root. The default `npm ci` requires a matching lockfile and fails
  // remotely with EUSAGE — `npm install` resolves fresh instead.
  .installCommand('npm install')
  .keepReleases(2)
  .build();
