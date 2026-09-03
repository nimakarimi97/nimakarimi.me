/**
 * Instagram API Service & Bookmarklet Generator
 * Facilitates direct session fetching via Vite dev proxy and in-browser Bookmarklet sync.
 */

const SLEEP_MS = 1100

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Common headers for proxy requests
 */
function getProxyHeaders(sessionConfig) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (sessionConfig.sessionid) {
    headers['x-ig-session'] = sessionConfig.sessionid.trim()
  }
  if (sessionConfig.userId) {
    headers['x-ig-user-id'] = sessionConfig.userId.trim()
  }
  if (sessionConfig.csrf) {
    headers['x-ig-csrf'] = sessionConfig.csrf.trim()
  }
  return headers
}

/**
 * Fetches user profile info to verify credentials and obtain user ID & stats
 */
export async function fetchUserProfile(username, sessionConfig, signal) {
  const cleanUser = username.replace(/^@/, '').trim()
  const res = await fetch(`/api/instagram/api/v1/users/web_profile_info/?username=${encodeURIComponent(cleanUser)}`, {
    headers: getProxyHeaders(sessionConfig),
    signal,
  })

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Authentication failed. Your sessionid cookie may have expired. Please refresh your Instagram session.')
    }
    throw new Error(`Profile fetch failed: HTTP ${res.status}`)
  }

  const data = await res.json()
  const user = data?.data?.user
  if (!user) {
    throw new Error('User profile not found in Instagram response.')
  }

  return {
    id: user.id,
    pk: user.id,
    username: user.username,
    fullName: user.full_name,
    profilePicUrl: user.profile_pic_url,
    totalFollowers: user.edge_followed_by?.count || 0,
    totalFollowing: user.edge_follow?.count || 0,
    isPrivate: user.is_private,
    isVerified: user.is_verified,
  }
}

/**
 * Paged fetch for followers list via proxy
 */
export async function fetchFollowersList(userId, sessionConfig, onProgress, signal) {
  const followers = []
  let nextMaxId = null
  let page = 1

  do {
    if (signal?.aborted) {
      throw new Error('Sync aborted by user')
    }

    let url = `/api/instagram/api/v1/friendships/${userId}/followers/?count=50&search_surface=follow_list_page`
    if (nextMaxId) {
      url += `&max_id=${encodeURIComponent(nextMaxId)}`
    }

    const res = await fetch(url, {
      headers: getProxyHeaders(sessionConfig),
      signal,
    })

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Rate limit reached on Instagram. Please pause and try again in 10-15 minutes.')
      }
      throw new Error(`Failed to fetch followers: HTTP ${res.status}`)
    }

    const data = await res.json()
    const users = data.users || []

    for (const u of users) {
      followers.push({
        username: u.username,
        full_name: u.full_name || '',
        profile_pic_url: u.profile_pic_url || '',
        is_verified: Boolean(u.is_verified),
      })
    }

    if (onProgress) {
      onProgress({
        stage: 'followers',
        page,
        fetched: followers.length,
      })
    }

    nextMaxId = data.next_max_id || null
    page++

    if (nextMaxId) {
      await sleep(SLEEP_MS)
    }
  } while (nextMaxId)

  return followers
}

/**
 * Paged fetch for following list via proxy
 */
export async function fetchFollowingList(userId, sessionConfig, onProgress, signal) {
  const following = []
  let nextMaxId = null
  let page = 1

  do {
    if (signal?.aborted) {
      throw new Error('Sync aborted by user')
    }

    let url = `/api/instagram/api/v1/friendships/${userId}/following/?count=50&search_surface=follow_list_page`
    if (nextMaxId) {
      url += `&max_id=${encodeURIComponent(nextMaxId)}`
    }

    const res = await fetch(url, {
      headers: getProxyHeaders(sessionConfig),
      signal,
    })

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Rate limit reached on Instagram. Please pause and try again in 10-15 minutes.')
      }
      throw new Error(`Failed to fetch following: HTTP ${res.status}`)
    }

    const data = await res.json()
    const users = data.users || []

    for (const u of users) {
      following.push({
        username: u.username,
        full_name: u.full_name || '',
        profile_pic_url: u.profile_pic_url || '',
        is_verified: Boolean(u.is_verified),
      })
    }

    if (onProgress) {
      onProgress({
        stage: 'following',
        page,
        fetched: following.length,
      })
    }

    nextMaxId = data.next_max_id || null
    page++

    if (nextMaxId) {
      await sleep(SLEEP_MS)
    }
  } while (nextMaxId)

  return following
}

/**
 * Generates bookmarklet / console script that runs inside an active Instagram tab.
 * It queries Instagram's internal friendship API with native cookies, avoiding CORS and 2FA.
 */
export function generateSyncScript(trackerUrl = window.location.href) {
  return `(async function() {
  if (!window.location.hostname.includes('instagram.com')) {
    alert('Please run this bookmarklet while logged in on https://www.instagram.com');
    return;
  }

  const existingUi = document.getElementById('ig-sync-box');
  if (existingUi) existingUi.remove();

  const box = document.createElement('div');
  box.id = 'ig-sync-box';
  box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;width:340px;background:#1a1a1a;color:#fff;padding:18px;border-radius:14px;box-shadow:0 12px 36px rgba(0,0,0,0.6);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:14px;border:1px solid #333;';
  box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><strong style="font-size:15px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">IG Tracker Sync</strong><button id="ig-sync-close" style="background:none;border:none;color:#aaa;cursor:pointer;font-size:16px;">✕</button></div><div id="ig-sync-status" style="color:#ddd;line-height:1.4;">Initializing sync...</div><div style="margin-top:12px;background:#333;border-radius:6px;height:8px;overflow:hidden;"><div id="ig-sync-bar" style="background:linear-gradient(90deg,#0d6efd,#6610f2);height:100%;width:5%;transition:width 0.3s ease;"></div></div>';
  document.body.appendChild(box);

  document.getElementById('ig-sync-close').onclick = () => box.remove();
  const statusEl = document.getElementById('ig-sync-status');
  const barEl = document.getElementById('ig-sync-bar');

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  try {
    const cookieMatch = document.cookie.match(/ds_user_id=([^;]+)/);
    const userId = cookieMatch ? cookieMatch[1] : (window._sharedData?.config?.viewerId || null);

    if (!userId) {
      statusEl.innerHTML = '<span style="color:#ff6b6b">Could not detect user ID. Please make sure you are logged into Instagram.</span>';
      return;
    }

    const headers = {
      'X-IG-App-ID': '936619743392459',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // 1. Fetch Followers
    statusEl.innerText = 'Scanning Followers...';
    barEl.style.width = '10%';
    const followers = [];
    let nextMaxId = null;

    do {
      let url = '/api/v1/friendships/' + userId + '/followers/?count=50&search_surface=follow_list_page';
      if (nextMaxId) url += '&max_id=' + encodeURIComponent(nextMaxId);
      const res = await fetch(url, { headers, credentials: 'include' });
      if (!res.ok) throw new Error('Followers fetch failed: ' + res.status);
      const data = await res.json();
      const users = data.users || [];
      for (const u of users) {
        followers.push({
          username: u.username,
          full_name: u.full_name || '',
          profile_pic_url: u.profile_pic_url || '',
          is_verified: !!u.is_verified,
        });
      }
      statusEl.innerHTML = 'Scanning Followers... <br><strong style="color:#38ef7d">' + followers.length + '</strong> loaded';
      nextMaxId = data.next_max_id || null;
      if (nextMaxId) await sleep(1000);
    } while (nextMaxId);

    // 2. Fetch Following
    statusEl.innerText = 'Scanning Following...';
    barEl.style.width = '55%';
    const following = [];
    nextMaxId = null;

    do {
      let url = '/api/v1/friendships/' + userId + '/following/?count=50&search_surface=follow_list_page';
      if (nextMaxId) url += '&max_id=' + encodeURIComponent(nextMaxId);
      const res = await fetch(url, { headers, credentials: 'include' });
      if (!res.ok) throw new Error('Following fetch failed: ' + res.status);
      const data = await res.json();
      const users = data.users || [];
      for (const u of users) {
        following.push({
          username: u.username,
          full_name: u.full_name || '',
          profile_pic_url: u.profile_pic_url || '',
          is_verified: !!u.is_verified,
        });
      }
      statusEl.innerHTML = 'Scanning Following... <br><strong style="color:#38ef7d">' + following.length + '</strong> loaded';
      nextMaxId = data.next_max_id || null;
      if (nextMaxId) await sleep(1000);
    } while (nextMaxId);

    barEl.style.width = '100%';

    const payload = {
      timestamp: Date.now(),
      dateStr: new Date().toLocaleString(),
      userId,
      followers,
      following,
      stats: {
        totalFollowers: followers.length,
        totalFollowing: following.length,
      },
    };

    const payloadJson = JSON.stringify(payload);

    function deliverPayload(targetWin) {
      if (!targetWin || targetWin.closed) return;
      try {
        targetWin.postMessage({ type: 'IG_TRACKER_SYNC', data: payload }, '*');
      } catch (e) {}
    }

    // Try posting message to opener if exists
    if (window.opener) {
      deliverPayload(window.opener);
    }

    // Listen for tracker window signaling it is ready
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'IG_TRACKER_READY') {
        deliverPayload(e.source);
      }
    });

    // Try BroadcastChannel
    try {
      const channel = new BroadcastChannel('ig_tracker_channel');
      channel.postMessage({ type: 'IG_TRACKER_SYNC', data: payload });
    } catch (e) {}

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(payloadJson);
    } catch (e) {}

    // Clean URL without large hash payload
    const cleanUrl = '${trackerUrl}'.split('#')[0];

    statusEl.innerHTML = '🎉 <strong style="color:#38ef7d">Sync Complete!</strong><br>'
      + followers.length + ' followers, ' + following.length + ' following loaded.<br><br>'
      + '<span style="font-size:12px;color:#aaa;">Data auto-copied to clipboard!</span><br><br>'
      + '<a id="ig-open-tracker-btn" href="' + cleanUrl + '" target="_blank" style="display:inline-block;padding:10px 20px;background:linear-gradient(45deg,#0d6efd,#6610f2);color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 4px 12px rgba(13,110,253,0.35);">Open Tracker Dashboard →</a>';

    const btn = document.getElementById('ig-open-tracker-btn');
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        const win = window.open(cleanUrl, '_blank');
        if (win) {
          let attempts = 0;
          const timer = setInterval(() => {
            attempts++;
            deliverPayload(win);
            if (attempts > 30) clearInterval(timer);
          }, 250);

          window.addEventListener('message', function onAck(e) {
            if (e.data && e.data.type === 'IG_TRACKER_ACK') {
              clearInterval(timer);
              window.removeEventListener('message', onAck);
              statusEl.innerHTML = '🎉 <strong style="color:#38ef7d">Transferred to Tracker!</strong><br>Check your tracker tab for the results.';
            } else if (e.data && e.data.type === 'IG_TRACKER_READY') {
              deliverPayload(win);
            }
          });
        }
      };
    }
  } catch (err) {
    statusEl.innerHTML = '❌ <span style="color:#ff6b6b">Error: ' + err.message + '</span>';
  }
})();`
}

/**
 * Creates a bookmarklet href string (`javascript:(function(){...})()`)
 */
export function generateBookmarkletHref(trackerUrl) {
  const code = generateSyncScript(trackerUrl)
  return `javascript:${encodeURIComponent(code)}`
}
