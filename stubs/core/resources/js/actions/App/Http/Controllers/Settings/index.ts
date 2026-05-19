import ProfileController from './ProfileController'
import ProfileAvatarController from './ProfileAvatarController'
import SecurityController from './SecurityController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    ProfileAvatarController: Object.assign(ProfileAvatarController, ProfileAvatarController),
    SecurityController: Object.assign(SecurityController, SecurityController),
}

export default Settings