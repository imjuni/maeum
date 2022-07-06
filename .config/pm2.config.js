/* eslint-disable camelcase */

module.exports = {
  apps: [
    {
      name: 'maeum-boilerplate',
      script: 'maeum.js',
      instances: 0,
      watch: false,
      max_memory_restart: '2G',
      autorestart: true,
      node_args: '--enable-source-maps',
      exp_backoff_restart_delay: 200,
      wait_ready: true,
      kill_timeout: 6000,
      exec_mode: 'cluster',
      silent: true,
      json: true,
      merge_logs: true,
      output: '/dev/null',
      error: '/dev/null',
      env: {
        TZ: 'Asia/Seoul',
      },
    },
  ],
};
