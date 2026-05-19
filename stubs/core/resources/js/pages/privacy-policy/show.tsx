import { Head } from '@inertiajs/react';
import { Mail, MapPin, Phone, Shield, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Dpo {
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
}

interface Controller {
    name: string;
    cnpj: string;
    address: string;
    email: string;
}

interface Retention {
    activity_log_days: number;
    personal_export_days: number;
    account_after_anonymization_years: number;
}

interface Props {
    dpo: Dpo;
    controller: Controller;
    retention: Retention;
}

export default function PrivacyPolicyShow({ dpo, controller, retention }: Props) {
    const { t } = useTranslation();
    const updatedAt = new Date().toLocaleDateString();

    return (
        <>
            <Head title={t('privacy_policy.head_title')} />

            <div className="mx-auto max-w-3xl space-y-10 p-6 lg:p-10">
                {/* Header */}
                <header className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Shield className="size-6 text-primary" aria-hidden />
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {t('privacy_policy.title')}
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.last_updated', { date: updatedAt })}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {t('privacy_policy.intro', { company: controller.name })}
                    </p>
                </header>

                <Separator />

                {/* Controladora */}
                <section className="space-y-4">
                    <SectionTitle>{t('privacy_policy.controller_title')}</SectionTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.controller_desc')}
                    </p>
                    <Card>
                        <CardContent className="pt-5">
                            <dl className="space-y-2 text-sm">
                                <Row label={controller.name} icon={<User className="size-4" />} />
                                <Row label={`${t('privacy_policy.cnpj_label')}: ${controller.cnpj}`} />
                                <Row
                                    label={controller.address}
                                    icon={<MapPin className="size-4" />}
                                />
                                <Row
                                    label={controller.email}
                                    icon={<Mail className="size-4" />}
                                    href={`mailto:${controller.email}`}
                                />
                            </dl>
                        </CardContent>
                    </Card>
                </section>

                {/* DPO */}
                <section className="space-y-4">
                    <SectionTitle>
                        {t('privacy_policy.dpo_title')}
                        <Badge variant="secondary" className="ml-2 align-middle text-xs">
                            LGPD Art. 41 · GDPR Art. 37
                        </Badge>
                    </SectionTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.dpo_desc')}
                    </p>
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="pb-2 pt-4">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Shield className="size-4 text-primary" aria-hidden />
                                {dpo.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{dpo.title}</p>
                        </CardHeader>
                        <CardContent className="pb-5">
                            <dl className="space-y-2 text-sm">
                                <Row
                                    label={dpo.email}
                                    icon={<Mail className="size-4" />}
                                    href={`mailto:${dpo.email}`}
                                />
                                <Row
                                    label={dpo.phone}
                                    icon={<Phone className="size-4" />}
                                    href={`tel:${dpo.phone}`}
                                />
                                <Row
                                    label={dpo.address}
                                    icon={<MapPin className="size-4" />}
                                />
                            </dl>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* Dados coletados */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.data_title')}</SectionTitle>
                    <p className="text-sm text-muted-foreground">{t('privacy_policy.data_desc')}</p>
                    <ul className="space-y-1 text-sm">
                        {[
                            'data_identification',
                            'data_technical',
                            'data_usage',
                            'data_consent',
                        ].map((key) => (
                            <ListItem key={key}>{t(`privacy_policy.${key}`)}</ListItem>
                        ))}
                    </ul>
                </section>

                {/* Finalidade */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.purpose_title')}</SectionTitle>
                    <ul className="space-y-1 text-sm">
                        {[
                            'purpose_auth',
                            'purpose_service',
                            'purpose_legal',
                            'purpose_audit',
                        ].map((key) => (
                            <ListItem key={key}>{t(`privacy_policy.${key}`)}</ListItem>
                        ))}
                    </ul>
                </section>

                {/* Base legal */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.legal_basis_title')}</SectionTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.legal_basis_desc')}
                    </p>
                    <ul className="space-y-1 text-sm">
                        {[
                            'legal_basis_consent',
                            'legal_basis_contract',
                            'legal_basis_legal',
                            'legal_basis_legitimate',
                        ].map((key) => (
                            <ListItem key={key}>{t(`privacy_policy.${key}`)}</ListItem>
                        ))}
                    </ul>
                </section>

                {/* Retenção */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.retention_title')}</SectionTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.retention_desc')}
                    </p>
                    <ul className="space-y-1 text-sm">
                        <ListItem>
                            {t('privacy_policy.retention_activity', {
                                days: retention.activity_log_days,
                            })}
                        </ListItem>
                        <ListItem>
                            {t('privacy_policy.retention_export', {
                                days: retention.personal_export_days,
                            })}
                        </ListItem>
                        <ListItem>{t('privacy_policy.retention_account')}</ListItem>
                        <ListItem>
                            {t('privacy_policy.retention_anonymized', {
                                years: retention.account_after_anonymization_years,
                            })}
                        </ListItem>
                    </ul>
                </section>

                {/* Direitos */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.rights_title')}</SectionTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.rights_desc')}
                    </p>
                    <ul className="space-y-1 text-sm">
                        {[
                            'rights_access',
                            'rights_rectification',
                            'rights_erasure',
                            'rights_portability',
                            'rights_revocation',
                        ].map((key) => (
                            <ListItem key={key}>{t(`privacy_policy.${key}`)}</ListItem>
                        ))}
                    </ul>
                    <p className="text-sm text-muted-foreground">{t('privacy_policy.rights_how')}</p>
                </section>

                {/* Cookies */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.cookies_title')}</SectionTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.cookies_desc')}
                    </p>
                    <div className="overflow-hidden rounded-lg border text-sm">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Categoria</th>
                                    <th className="px-4 py-2 text-left font-medium">Descrição</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(
                                    [
                                        ['cookies_essential_name', 'cookies_essential_desc'],
                                        ['cookies_analytics_name', 'cookies_analytics_desc'],
                                        ['cookies_marketing_name', 'cookies_marketing_desc'],
                                    ] as const
                                ).map(([nameKey, descKey]) => (
                                    <tr key={nameKey} className="hover:bg-muted/20">
                                        <td className="px-4 py-2 font-medium">
                                            {t(`privacy_policy.${nameKey}`)}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {t(`privacy_policy.${descKey}`)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Segurança */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.security_title')}</SectionTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {t('privacy_policy.security_desc')}
                    </p>
                </section>

                {/* Incidentes */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.breach_title')}</SectionTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {t('privacy_policy.breach_desc')}
                    </p>
                </section>

                {/* Alterações */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.changes_title')}</SectionTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {t('privacy_policy.changes_desc')}
                    </p>
                </section>

                {/* Contato */}
                <section className="space-y-3">
                    <SectionTitle>{t('privacy_policy.contact_title')}</SectionTitle>
                    <p className="text-sm text-muted-foreground">
                        {t('privacy_policy.contact_desc')}
                    </p>
                    <p className="text-sm">
                        <a
                            href={`mailto:${controller.email}`}
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            {controller.email}
                        </a>
                    </p>
                </section>
            </div>
        </>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold tracking-tight">{children}</h2>;
}

function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            {children}
        </li>
    );
}

function Row({
    label,
    icon,
    href,
}: {
    label: string;
    icon?: React.ReactNode;
    href?: string;
}) {
    const content = href ? (
        <a href={href} className="text-primary underline-offset-4 hover:underline">
            {label}
        </a>
    ) : (
        <span>{label}</span>
    );

    return (
        <div className="flex items-start gap-2 text-foreground/80">
            {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
            {content}
        </div>
    );
}
