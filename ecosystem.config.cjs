module.exports = {
  apps: [
    {
      name: "shivaryan",
      script: ".output/server/index.mjs",
      interpreter: "node",
      cwd: "/var/www/Shivaryan",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOST: "127.0.0.1",
        SUPABASE_URL: "https://hrqxfuinvlevbgttabrn.supabase.co",
        SUPABASE_PUBLISHABLE_KEY:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhycXhmdWludmxldmJndHRhYnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Njk0OTUsImV4cCI6MjA5ODU0NTQ5NX0.A17OPNqXyj2ouuD67vbttaR1umuemUvVDBevTtzai8o",
      },
    },
  ],
};