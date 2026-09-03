/**
 * Storage manager for Instagram Tracker
 * Handles local persistence, snapshot history, and diffing algorithms.
 */

const STORAGE_KEY_SNAPSHOTS = 'ig_tracker_snapshots'
const STORAGE_KEY_SESSION = 'ig_tracker_session'
const STORAGE_KEY_LEGACY = 'instagram_tracker_data'

/**
 * Normalizes user item to an object with at least { username, full_name, profile_pic_url, is_verified }
 */
export function normalizeUser(user) {
  if (!user)
    return null
  if (typeof user === 'string') {
    return {
      username: user.toLowerCase().trim(),
      full_name: '',
      profile_pic_url: '',
      is_verified: false,
    }
  }
  const username = (user.username || user.value || user.title || '').toLowerCase().trim()
  if (!username)
    return null

  return {
    username,
    full_name: user.full_name || user.fullName || '',
    profile_pic_url: user.profile_pic_url || user.profilePicUrl || '',
    is_verified: Boolean(user.is_verified || user.isVerified),
  }
}

/**
 * Normalizes array of user objects or strings
 */
export function normalizeUserList(list) {
  if (!Array.isArray(list))
    return []
  const seen = new Set()
  const result = []

  for (const item of list) {
    const normalized = normalizeUser(item)
    if (normalized && !seen.has(normalized.username)) {
      seen.add(normalized.username)
      result.push(normalized)
    }
  }
  return result
}

/**
 * Retrieves all saved snapshots from localStorage, ordered by timestamp descending
 */
export function getSavedSnapshots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SNAPSHOTS)
    if (!raw)
      return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed))
      return []
    return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  } catch (err) {
    console.error('Failed to parse saved snapshots:', err)
    return []
  }
}

/**
 * Saves a new snapshot to localStorage
 */
export function saveSnapshot(snapshot) {
  try {
    const snapshots = getSavedSnapshots()
    const newSnapshot = {
      id: snapshot.id || `snap_${Date.now()}`,
      timestamp: snapshot.timestamp || Date.now(),
      dateStr: snapshot.dateStr || new Date().toLocaleString(),
      username: snapshot.username || '',
      userId: snapshot.userId || '',
      stats: {
        totalFollowers: snapshot.followers?.length || 0,
        totalFollowing: snapshot.following?.length || 0,
      },
      followers: normalizeUserList(snapshot.followers),
      following: normalizeUserList(snapshot.following),
    }

    // Keep up to 30 snapshots to avoid localStorage quota issues
    const updated = [newSnapshot, ...snapshots.filter(s => s.id !== newSnapshot.id)].slice(0, 30)
    localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(updated))
    return newSnapshot
  } catch (err) {
    console.error('Failed to save snapshot:', err)
    throw err
  }
}

/**
 * Deletes a snapshot by ID
 */
export function deleteSnapshot(id) {
  try {
    const snapshots = getSavedSnapshots()
    const filtered = snapshots.filter(s => s.id !== id)
    localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(filtered))
    return filtered
  } catch (err) {
    console.error('Failed to delete snapshot:', err)
    return getSavedSnapshots()
  }
}

/**
 * Clears all snapshots
 */
export function clearAllSnapshots() {
  localStorage.removeItem(STORAGE_KEY_SNAPSHOTS)
}

/**
 * Computes relationship comparison and historical diff between current and previous snapshot
 */
export function computeDiff(currentSnapshot, previousSnapshot = null) {
  if (!currentSnapshot) {
    return {
      notFollowingBack: [],
      youDontFollowBack: [],
      mutualFollowers: [],
      lostFollowers: [],
      newFollowers: [],
      lostFollowing: [],
      newFollowing: [],
      counts: {
        notFollowingBack: 0,
        youDontFollowBack: 0,
        mutualFollowers: 0,
        lostFollowers: 0,
        newFollowers: 0,
        lostFollowing: 0,
        newFollowing: 0,
      },
      stats: {
        totalFollowers: 0,
        totalFollowing: 0,
      },
    }
  }

  const followers = normalizeUserList(currentSnapshot.followers)
  const following = normalizeUserList(currentSnapshot.following)

  const followersMap = new Map(followers.map(u => [u.username, u]))
  const followingMap = new Map(following.map(u => [u.username, u]))

  // Standard relationship calculations
  const notFollowingBack = following.filter(u => !followersMap.has(u.username))
  const youDontFollowBack = followers.filter(u => !followingMap.has(u.username))
  const mutualFollowers = followers.filter(u => followingMap.has(u.username))

  // Historical diff calculations (if previous snapshot exists)
  let lostFollowers = []
  let newFollowers = []
  let lostFollowing = []
  let newFollowing = []

  if (previousSnapshot) {
    const prevFollowers = normalizeUserList(previousSnapshot.followers)
    const prevFollowing = normalizeUserList(previousSnapshot.following)

    const prevFollowersMap = new Map(prevFollowers.map(u => [u.username, u]))
    const prevFollowingMap = new Map(prevFollowing.map(u => [u.username, u]))

    // Lost followers = were in previous followers, but NOT in current followers
    lostFollowers = prevFollowers.filter(u => !followersMap.has(u.username))
    // New followers = are in current followers, but were NOT in previous followers
    newFollowers = followers.filter(u => !prevFollowersMap.has(u.username))

    // Lost following = were in previous following, but NOT in current following
    lostFollowing = prevFollowing.filter(u => !followingMap.has(u.username))
    // New following = are in current following, but were NOT in previous following
    newFollowing = following.filter(u => !prevFollowingMap.has(u.username))
  }

  return {
    notFollowingBack,
    youDontFollowBack,
    mutualFollowers,
    lostFollowers,
    newFollowers,
    lostFollowing,
    newFollowing,
    counts: {
      notFollowingBack: notFollowingBack.length,
      youDontFollowBack: youDontFollowBack.length,
      mutualFollowers: mutualFollowers.length,
      lostFollowers: lostFollowers.length,
      newFollowers: newFollowers.length,
      lostFollowing: lostFollowing.length,
      newFollowing: newFollowing.length,
    },
    stats: {
      totalFollowers: followers.length,
      totalFollowing: following.length,
    },
  }
}

/**
 * Manages saved session preferences
 */
export function getSavedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession(session) {
  try {
    if (!session || !session.remember) {
      localStorage.removeItem(STORAGE_KEY_SESSION)
    } else {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({
        sessionid: session.sessionid || '',
        userId: session.userId || '',
        username: session.username || '',
        remember: true,
      }))
    }
  } catch (err) {
    console.error('Failed to save session:', err)
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY_SESSION)
}

/**
 * Migrates data from legacy localStorage key 'instagram_tracker_data' if present
 */
export function migrateLegacyData() {
  try {
    const legacyRaw = localStorage.getItem(STORAGE_KEY_LEGACY)
    if (!legacyRaw)
      return null

    const snapshots = getSavedSnapshots()
    if (snapshots.length > 0)
      return null // Already have snapshots

    const parsed = JSON.parse(legacyRaw)
    if (parsed.results) {
      // Reconstruct followers and following sets if possible
      const mutual = parsed.results.mutualFollowers || []
      const notFollowingBack = parsed.results.notFollowingBack || []
      const youDontFollowBack = parsed.results.youDontFollowBack || []

      const followers = [...mutual, ...youDontFollowBack]
      const following = [...mutual, ...notFollowingBack]

      const migrated = saveSnapshot({
        id: 'legacy_snapshot',
        dateStr: parsed.lastUpdated || 'Previous Scan',
        timestamp: Date.now() - 86400000, // approximate 1 day ago
        followers,
        following,
      })
      return migrated
    }
  } catch (err) {
    console.error('Failed to migrate legacy data:', err)
  }
  return null
}
