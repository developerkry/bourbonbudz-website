#!/bin/bash
# Complete VM Setup Script for Bourbon Budz Website with RTMP/HLS Streaming
# Run this script on your Ubuntu 22.04 VM

set -e

echo "🚀 Starting Bourbon Budz VM Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y build-essential curl git ufw nginx nano ffmpeg

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install npm if not installed
sudo apt install -y npm

# Install Nginx RTMP module
echo "📡 Installing Nginx RTMP module..."
sudo apt install -y libnginx-mod-rtmp

# Set up firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 1935/tcp   # RTMP port
sudo ufw --force enable

# Create HLS directory
echo "📁 Creating HLS directory..."
sudo mkdir -p /var/www/hls
sudo chown -R www-data:www-data /var/www/hls
sudo chmod -R 755 /var/www/hls

# Backup original nginx config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Create new nginx config with RTMP and HLS support
echo "⚙️ Configuring Nginx with RTMP and HLS..."
sudo tee /etc/nginx/nginx.conf > /dev/null <<'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

# RTMP Configuration
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        allow publish all;
        
        application live {
            live on;
            record off;
            
            # Enable HLS
            hls on;
            hls_path /var/www/hls;
            hls_fragment 3;
            hls_playlist_length 60;
            hls_continuous on;
            hls_cleanup on;
            hls_nested on;
            
            # Allow from anywhere
            allow publish all;
            allow play all;
        }
    }
}

# HTTP Configuration
http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Gzip
    gzip on;
    
    server {
        listen 80;
        server_name bourbonbudz.duckdns.org 34.55.39.199;
        
        # Serve HLS files
        location /hls {
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            root /var/www;
            add_header Cache-Control no-cache;
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods GET;
            add_header Access-Control-Allow-Headers Range;
        }
        
        # Proxy to Next.js app
        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

# Test nginx config
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Restart nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Clone project (if not already present)
cd ~
if [ ! -d "bourbonbudz-website" ]; then
    echo "📥 Cloning project..."
    git clone https://github.com/developerkry/bourbonbudz-website.git
fi

cd bourbonbudz-website

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Install PM2 globally
echo "🔧 Installing PM2..."
sudo npm install -g pm2

# Create .env file template
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file template..."
    cat > .env << 'EOF'
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://bourbonbudz.duckdns.org"
NEXTAUTH_SECRET="your-secret-key-here"

# Stream settings
RTMP_SERVER_URL="rtmp://bourbonbudz.duckdns.org/live"
HLS_BASE_URL="http://bourbonbudz.duckdns.org/hls"

# Add your other environment variables here
EOF
    echo "⚠️  Please edit .env file with your actual values"
fi

echo ""
echo "🎉 Setup Complete! 🎉"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env file with your actual values:"
echo "   nano .env"
echo ""
echo "2. Generate Prisma client and run migrations:"
echo "   npx prisma generate"
echo "   npx prisma migrate dev"
echo ""
echo "3. Build and start your app:"
echo "   npm run build"
echo "   pm2 start npm --name 'bourbon-budz' -- start"
echo "   pm2 startup"
echo "   pm2 save"
echo ""
echo "📡 Streaming URLs:"
echo "   RTMP Ingest: rtmp://bourbonbudz.duckdns.org/live/YOUR_STREAM_KEY"
echo "   HLS Playback: http://bourbonbudz.duckdns.org/hls/YOUR_STREAM_KEY.m3u8"
echo ""
echo "🌐 Website: http://bourbonbudz.duckdns.org"
echo ""
echo "🔧 OBS Setup:"
echo "   Server: rtmp://bourbonbudz.duckdns.org/live"
echo "   Stream Key: [Your stream key]"
echo ""
