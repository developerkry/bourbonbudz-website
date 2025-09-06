const NodeMediaServer = require('node-media-server');
const fetch = require('node-fetch');

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
    allow_origin: '*'
  },
  relay: {
    ffmpeg: '/usr/local/bin/ffmpeg', // Update this path based on your system
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

// Validate stream keys against your API
nms.on('prePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/').pop();
  console.log(`[NodeMediaServer] Stream attempt with key: ${streamKey}`);
  
  try {
    const response = await fetch(`http://localhost:3000/api/stream-keys?action=validate&key=${streamKey}`);
    const data = await response.json();
    
    if (!data.valid) {
      const session = nms.getSession(id);
      session.reject();
      console.log(`[NodeMediaServer] ❌ Stream key validation failed: ${streamKey}`);
    } else {
      console.log(`[NodeMediaServer] ✅ Stream key validated: ${streamKey}`);
      
      // Update last used timestamp
      await fetch('http://localhost:3000/api/stream-keys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateLastUsed',
          key: streamKey
        }),
      });
    }
  } catch (error) {
    console.error('[NodeMediaServer] Validation error:', error);
    const session = nms.getSession(id);
    session.reject();
  }
});

// Log when streams start
nms.on('postPublish', (id, StreamPath, args) => {
  console.log(`[NodeMediaServer] 🔴 Stream started: ${StreamPath}`);
});

// Log when streams end
nms.on('donePublish', (id, StreamPath, args) => {
  console.log(`[NodeMediaServer] ⏹️ Stream ended: ${StreamPath}`);
});

// Start the server
nms.run();

console.log('🚀 Bourbon Budz RTMP Server Started!');
console.log('📡 RTMP Server running on port 1935');
console.log('🌐 HTTP Server running on port 8000');
console.log('');
console.log('📋 Configuration:');
console.log(`   RTMP URL: rtmp://localhost:1935/live`);
console.log(`   HLS URL: http://localhost:8000/live`);
console.log('');
console.log('🔧 OBS Studio Setup:');
console.log('   1. Go to Settings → Stream');
console.log('   2. Set Service to "Custom..."');
console.log('   3. Server: rtmp://localhost:1935/live');
console.log('   4. Stream Key: [Get from /admin/rtmp]');
console.log('');
console.log('⚠️  Make sure your Next.js app is running on port 3000 for stream key validation');
console.log('');
console.log('🎬 Ready to stream!');
