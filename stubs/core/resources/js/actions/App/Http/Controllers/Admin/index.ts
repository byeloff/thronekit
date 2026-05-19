import UserController from './UserController'
import FeatureFlagController from './FeatureFlagController'
import NotificationController from './NotificationController'

const Admin = {
    UserController: Object.assign(UserController, UserController),
    FeatureFlagController: Object.assign(FeatureFlagController, FeatureFlagController),
    NotificationController: Object.assign(NotificationController, NotificationController),
}

export default Admin