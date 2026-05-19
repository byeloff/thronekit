import TermsController from './TermsController'
import PrivacyPolicyController from './PrivacyPolicyController'
import CookieConsentController from './CookieConsentController'
import NotificationController from './NotificationController'
import PrivacyController from './PrivacyController'
import LocaleController from './LocaleController'
import Admin from './Admin'
import Dev from './Dev'
import Settings from './Settings'

const Controllers = {
    TermsController: Object.assign(TermsController, TermsController),
    PrivacyPolicyController: Object.assign(PrivacyPolicyController, PrivacyPolicyController),
    CookieConsentController: Object.assign(CookieConsentController, CookieConsentController),
    NotificationController: Object.assign(NotificationController, NotificationController),
    PrivacyController: Object.assign(PrivacyController, PrivacyController),
    LocaleController: Object.assign(LocaleController, LocaleController),
    Admin: Object.assign(Admin, Admin),
    Dev: Object.assign(Dev, Dev),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers