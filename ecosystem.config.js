module.exports = {
  apps: [
    {
      name: 'BignLean-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      env: {
        PORT: 5442,
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_BASE_URL: 'https://api.bignlean.com/'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}; 