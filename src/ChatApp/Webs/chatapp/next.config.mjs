/** @type {import('next').NextConfig} */
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com']
  },
  plugins: [
    new MiniCssExtractPlugin()
  ]
};

export default nextConfig;
