const NodeMediaServer = require('node-media-server');
const fetch = require('node-fetch');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

// Configuration
const localIP = getLocalIP();
const publicIP = process.env.PUBLIC_IP || 'YOUR_PUBLIC_IP_HERE'; // Set this to your public IP
const websiteUrl = process.env.WEBSITE_URL || 'https://your-site.vercel.app'; // Your Vercel URL

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*', // Allow all origins for CORS
    api: true // Enable stats API
  },
  relay: {
    ffmpeg: process.platform === 'win32' 
      ? 'C:\\ffmpeg\\bin\\ffmpeg.exe' 
      : '/usr/local/bin/ffmpeg', // Cross-platform ffmpeg path
    tasks: [
      {
        app: 'live',
        mode: 'push',
        edge: 'rtmp://127.0.0.1/hls'
      }
    ]
  },
  auth: {
    play: false,
    publish: true,
    secret: 'bourbonbudz2024'
  }
};

const nms = new NodeMediaServer(config);

// Connection tracking
let activeStreams = new Map();

// Validate stream keys against your website
nms.on('prePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/').pop();
  console.log(`[RTMP] 🔑 Stream attempt with key: ${streamKey}`);
  
  try {
    const response = await fetch(`${websiteUrl}/api/stream-keys?action=validate&key=${streamKey}`, {
      timeout: 5000 // 5 second timeout
    });
    const data = await response.json();
    
    if (!data.valid) {
      const session = nms.getSession(id);
      session.reject();
      console.log(`[RTMP] ❌ Stream key rejected: ${streamKey}`);
    } else {
      console.log(`[RTMP] ✅ Stream key validated: ${streamKey}`);
      activeStreams.set(id, { streamKey, startTime: new Date() });
      
      // Update last used timestamp
      try {
        await fetch(`${websiteUrl}/api/stream-keys`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateLastUsed',
            key: streamKey
          }),
          timeout: 3000
        });
      } catch (updateError) {
        console.log('[RTMP] ⚠️ Could not update last used timestamp:', updateError.message);
      }
    }
  } catch (error) {
    console.error('[RTMP] ❌ Validation error:', error.message);
    console.log('[RTMP] 🔄 Rejecting stream due to validation failure');
    const session = nms.getSession(id);
    session.reject();
  }
});

// Log when streams start
nms.on('postPublish', (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/').pop();
  console.log(`[RTMP] 🔴 Stream LIVE: ${streamKey}`);
  console.log(`[RTMP] 📺 HLS URL: http://${publicIP}:8000/live/${streamKey}.m3u8`);
});

// Log when streams end
nms.on('donePublish', (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/').pop();
  const streamInfo = activeStreams.get(id);
  
  if (streamInfo) {
    const duration = Math.round((new Date() - streamInfo.startTime) / 1000);
    console.log(`[RTMP] ⏹️ Stream ended: ${streamKey} (Duration: ${duration}s)`);
    activeStreams.delete(id);
  } else {
    console.log(`[RTMP] ⏹️ Stream ended: ${streamKey}`);
  }
});

// Periodic status updates
setInterval(() => {
  const activeCount = activeStreams.size;
  if (activeCount > 0) {
    console.log(`[RTMP] 📊 Active streams: ${activeCount}`);
    activeStreams.forEach((info, id) => {
      const duration = Math.round((new Date() - info.startTime) / 1000);
      console.log(`  🎥 ${info.streamKey}: ${duration}s`);
    });
  }
}, 60000); // Every minute

// Start the server
nms.run();

// Startup information
console.log('🚀 Bourbon Budz Home RTMP Server Started!');
console.log('═'.repeat(50));
console.log('📡 RTMP Server running on port 1935');
console.log('🌐 HTTP Server running on port 8000');
console.log('');
console.log('🏠 Local Network Configuration:');
console.log(`   Local IP: ${localIP}`);
console.log(`   RTMP URL: rtmp://${localIP}:1935/live`);
console.log(`   HLS URL: http://${localIP}:8000/live`);
console.log('');
console.log('🌍 Public Configuration:');
console.log(`   Public IP: ${publicIP}`);
console.log(`   RTMP URL: rtmp://${publicIP}:1935/live`);
console.log(`   HLS URL: http://${publicIP}:8000/live`);
console.log('');
console.log('🔧 OBS Studio Setup:');
console.log('   1. Go to Settings → Stream');
console.log('   2. Service: Custom...');
console.log(`   3. Server: rtmp://${localIP}:1935/live`);
console.log('   4. Stream Key: [Get from your website admin panel]');
console.log('');
console.log('🌐 Website Integration:');
console.log(`   Website URL: ${websiteUrl}`);
console.log('   Admin panel: /admin/rtmp');
console.log('');
console.log('⚠️  IMPORTANT SETUP REMINDERS:');
console.log('   • Port 1935 (RTMP) must be forwarded in your router');
console.log('   • Port 8000 (HTTP) must be forwarded in your router');
console.log('   • Windows Firewall must allow both ports');
console.log('   • Update PUBLIC_IP and WEBSITE_URL environment variables');
console.log('');
console.log('📋 Quick Router Setup:');
console.log(`   Forward port 1935 TCP → ${localIP}:1935`);
console.log(`   Forward port 8000 TCP → ${localIP}:8000`);
console.log('');
console.log('🔍 Test URLs:');
console.log(`   RTMP Stats: http://${localIP}:8000/api/streams`);
console.log(`   Server Info: http://${localIP}:8000/admin`);
console.log('');
console.log('🎬 Ready to stream! Start OBS and begin streaming.');
console.log('═'.repeat(50));

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[RTMP] 🛑 Shutting down server...');
  nms.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[RTMP] 🛑 Server terminated');
  nms.stop();
  process.exit(0);
});
