import React from 'react'
import { useSearchParams } from 'react-router-dom'

const YtPreview = () => {

  const [searchParams] = useSearchParams()
  const thumbnail_url = searchParams.get('thumbnail_url')
  const title = searchParams.get('title')

  const yt_html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>YouTube Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0f0f0f; font-family: 'Roboto', Arial, sans-serif; color: #fff; }

    .yt-container { max-width: 1280px; margin: 0 auto; padding: 20px 16px; }

    /* Top Navbar */
    .navbar { display: flex; align-items: center; justify-content: space-between;
      padding: 8px 16px; background: #0f0f0f; position: sticky; top: 0; z-index: 10; }
    .navbar-left { display: flex; align-items: center; gap: 16px; }
    .yt-logo { display: flex; align-items: center; gap: 4px; font-size: 20px; font-weight: 700; color: #fff; }
    .yt-logo span { color: #ff0000; font-size: 24px; }
    .search-bar { display: flex; align-items: center; background: #121212;
      border: 1px solid #303030; border-radius: 40px; overflow: hidden; }
    .search-bar input { background: transparent; border: none; outline: none;
      color: #fff; padding: 8px 16px; width: 320px; font-size: 14px; }
    .search-bar button { background: #222; border: none; padding: 8px 16px; cursor: pointer; color: #fff; }

    /* Video Layout */
    .video-layout { display: flex; gap: 24px; margin-top: 24px; }
    .main-video { flex: 1; }
    .video-thumbnail-wrap { position: relative; width: 100%; border-radius: 12px; overflow: hidden; }
    .video-thumbnail-wrap img { width: 100%; display: block; aspect-ratio: 16/9; object-fit: cover; }
    .duration-badge { position: absolute; bottom: 8px; right: 8px;
      background: rgba(0,0,0,0.8); color: #fff; font-size: 12px;
      padding: 2px 6px; border-radius: 4px; font-weight: 600; }
    .video-title { font-size: 18px; font-weight: 600; margin: 12px 0 6px; line-height: 1.4; }
    .video-meta { font-size: 13px; color: #aaa; margin-bottom: 10px; }

    /* Channel Info */
    .channel-row { display: flex; align-items: center; justify-content: space-between; margin: 12px 0; }
    .channel-info { display: flex; align-items: center; gap: 12px; }
    .channel-avatar { width: 40px; height: 40px; border-radius: 50%; background: #555;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
    .channel-name { font-size: 14px; font-weight: 600; }
    .channel-subs { font-size: 12px; color: #aaa; }
    .subscribe-btn { background: #fff; color: #000; border: none; border-radius: 20px;
      padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }

    /* Action Buttons */
    .action-btns { display: flex; gap: 8px; }
    .action-btn { background: #272727; color: #fff; border: none; border-radius: 20px;
      padding: 8px 14px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; }

    /* Sidebar */
    .sidebar { width: 400px; display: flex; flex-direction: column; gap: 12px; }
    .suggested-card { display: flex; gap: 8px; cursor: pointer; }
    .suggested-thumb { width: 168px; min-width: 168px; aspect-ratio: 16/9;
      border-radius: 8px; overflow: hidden; background: #333; }
    .suggested-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .suggested-info { flex: 1; }
    .suggested-title { font-size: 13px; font-weight: 600; line-height: 1.3; margin-bottom: 4px; }
    .suggested-channel { font-size: 12px; color: #aaa; }
    .suggested-views { font-size: 12px; color: #aaa; }
  </style>
</head>
<body>

  <!-- Navbar -->
  <div class="navbar">
    <div class="navbar-left">
      <div class="yt-logo"><span>▶</span> YouTube</div>
    </div>
    <div class="search-bar">
      <input type="text" placeholder="Search" />
      <button>🔍</button>
    </div>
    <div style="width:80px"></div>
  </div>

  <div class="yt-container">
    <div class="video-layout">

      <!-- Main Video -->
      <div class="main-video">
        <div class="video-thumbnail-wrap">
          <img src="%%THUMBNAIL_URL%%" alt="thumbnail" />
          <span class="duration-badge">10:32</span>
        </div>

        <div class="video-title">%%TITLE%%</div>
        <div class="video-meta">1.2M views &nbsp;•&nbsp; 3 days ago</div>

        <div class="channel-row">
          <div class="channel-info">
            <div class="channel-avatar">T</div>
            <div>
              <div class="channel-name">ThumbLab Channel</div>
              <div class="channel-subs">500K subscribers</div>
            </div>
          </div>
          <button class="subscribe-btn">Subscribe</button>
        </div>

        <div class="action-btns">
          <button class="action-btn">👍 45K</button>
          <button class="action-btn">👎 Dislike</button>
          <button class="action-btn">↗ Share</button>
          <button class="action-btn">⬇ Download</button>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        ${[
          { title: 'How to grow on YouTube in 2025', views: '850K views', channel: 'Creator Tips' },
          { title: 'Best Thumbnail Design Secrets', views: '1.1M views', channel: 'Design Pro' },
          { title: 'AI Tools Every Creator Needs', views: '600K views', channel: 'Tech With Sam' },
          { title: 'YouTube Algorithm Explained', views: '2.3M views', channel: 'VidIQ Official' },
          { title: 'How to Edit Videos Like a Pro', views: '980K views', channel: 'Edit Master' },
        ].map(v => `
          <div class="suggested-card">
            <div class="suggested-thumb">
              <img src="https://picsum.photos/seed/${Math.random()}/168/94" alt="thumb"/>
            </div>
            <div class="suggested-info">
              <div class="suggested-title">${v.title}</div>
              <div class="suggested-channel">${v.channel}</div>
              <div class="suggested-views">${v.views}</div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </div>

</body>
</html>`

  const new_html = yt_html
    .replace('%%THUMBNAIL_URL%%', thumbnail_url)
    .replace('%%TITLE%%', title)

  return (
    <div className='fixed inset-0 z-[100] bg-black'>
      <iframe
        srcDoc={new_html}
        frameBorder='0'
        width='100%'
        height='100%'
      />
    </div>
  )
}

export default YtPreview