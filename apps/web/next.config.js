/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow LAN IP access from mobile devices during development
  allowedDevOrigins: ['192.168.1.21', 'localhost', '127.0.0.1'],
};

export default nextConfig;
