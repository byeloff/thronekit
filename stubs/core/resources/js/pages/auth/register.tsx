import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { PasswordStrength } from '@/components/password-strength';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { PasswordPolicy } from '@/hooks/use-password-strength';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordPolicy: PasswordPolicy;
};

export default function Register({ passwordPolicy }: Props) {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');

    setLayoutProps({
        title: t('auth.register.title'),
        description: t('auth.register.description'),
    });

    return (
        <>
            <Head title={t('auth.register.head_title')} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">
                                    {t('auth.register.name')}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={t(
                                        'auth.register.name_placeholder',
                                    )}
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('auth.register.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder={t(
                                        'auth.register.email_placeholder',
                                    )}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('auth.register.password')}
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={t(
                                        'auth.register.password_placeholder',
                                    )}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <PasswordStrength value={password} policy={passwordPolicy} />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {t('auth.register.confirm_password')}
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={t(
                                        'auth.register.confirm_password_placeholder',
                                    )}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="terms_accepted"
                                    name="terms_accepted"
                                    value="1"
                                    required
                                    tabIndex={5}
                                />
                                <Label
                                    htmlFor="terms_accepted"
                                    className="text-sm leading-snug font-normal text-muted-foreground"
                                >
                                    <Trans
                                        i18nKey="auth.register.terms_accept"
                                        components={{
                                            terms: (
                                                <TextLink
                                                    href="/terms"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                />
                                            ),
                                            privacy: (
                                                <TextLink
                                                    href="/privacy-policy"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                />
                                            ),
                                        }}
                                    />
                                </Label>
                            </div>
                            <InputError message={errors.terms_accepted} />

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                {t('auth.register.submit')}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {t('auth.register.has_account')}{' '}
                            <TextLink href={login()} tabIndex={7}>
                                {t('auth.register.log_in')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}
