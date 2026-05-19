import users from './users'
import featureFlags from './feature-flags'
import notifications from './notifications'

const admin = {
    users: Object.assign(users, users),
    featureFlags: Object.assign(featureFlags, featureFlags),
    notifications: Object.assign(notifications, notifications),
}

export default admin