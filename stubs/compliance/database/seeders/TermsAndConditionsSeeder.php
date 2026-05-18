<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\TermsAndCondition;
use Illuminate\Database\Seeder;

/**
 * Cria a versão inicial dos Termos e Condições nos três locales suportados.
 * Substitua o conteúdo placeholder pelo texto definitivo antes de subir para
 * produção. Para publicar uma nova versão, crie um novo registro com
 * `version` diferente — o middleware EnsureTermsAccepted automaticamente
 * bloqueará usuários que ainda não aceitaram a nova revisão.
 */
final class TermsAndConditionsSeeder extends Seeder
{
    public function run(): void
    {
        $version = '2026-05-17';

        // ⚠️  TEMPLATE — substitua pelo texto jurídico definitivo revisado por advogado.
        $contents = [
            'pt_BR' => <<<'MD'
                # Termos e Condições de Uso

                **Versão:** 2026-05-17 | **Vigência:** a partir de 17 de maio de 2026

                > ⚠️ Este é um template. Substitua pelo texto jurídico definitivo antes de ir para produção.

                ## 1. Das Partes

                O presente instrumento é celebrado entre **Vibbe Tecnologia Ltda.** ("Vibbe" ou "nós"), pessoa jurídica inscrita no CNPJ sob o nº 00.000.000/0001-00, com sede na Av. Paulista, 1000, São Paulo/SP, e o **Usuário** ("você"), pessoa física que se cadastra na plataforma Vibbe Backstage.

                ## 2. Aceitação

                Ao criar uma conta ou utilizar a plataforma, você declara ter lido, compreendido e concordado com estes Termos e com a nossa [Política de Privacidade](/privacy-policy). Se você não concordar, não utilize a plataforma.

                ## 3. Objeto

                A Vibbe oferece uma plataforma de gestão e colaboração ("Plataforma") acessível mediante cadastro. A Vibbe pode alterar, suspender ou encerrar funcionalidades a qualquer tempo, com aviso prévio razoável.

                ## 4. Cadastro e Segurança da Conta

                4.1. Você deve fornecer informações verdadeiras e mantê-las atualizadas.

                4.2. Você é responsável por manter a confidencialidade de suas credenciais de acesso.

                4.3. Notifique-nos imediatamente em caso de acesso não autorizado à sua conta.

                ## 5. Uso Permitido

                5.1. Você concorda em usar a Plataforma somente para fins lícitos e de acordo com estes Termos.

                5.2. É proibido: (a) violar leis ou regulações aplicáveis; (b) transmitir conteúdo ilegal, difamatório ou que infrinja direitos de terceiros; (c) tentar acessar sistemas ou dados de outros usuários; (d) realizar engenharia reversa ou qualquer forma de extração indevida de código.

                ## 6. Dados Pessoais (LGPD)

                O tratamento dos seus dados pessoais é regido pela nossa [Política de Privacidade](/privacy-policy), em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).

                **Seus direitos:** Você pode acessar, corrigir, exportar ou solicitar a anonimização dos seus dados a qualquer momento em **Configurações → Privacidade**.

                ## 7. Propriedade Intelectual

                Todo o conteúdo da Plataforma (código, design, marcas, logotipos) pertence à Vibbe ou a seus licenciantes e é protegido pela legislação de propriedade intelectual vigente.

                ## 8. Limitação de Responsabilidade

                A Vibbe não se responsabiliza por danos indiretos, consequentes ou lucros cessantes decorrentes do uso ou da impossibilidade de uso da Plataforma, na máxima extensão permitida pela legislação aplicável.

                ## 9. Prazo e Rescisão

                Estes Termos vigoram enquanto você mantiver uma conta ativa. Você pode encerrar sua conta a qualquer momento em **Configurações → Privacidade → Excluir minha conta**. A Vibbe pode suspender ou encerrar contas que violem estes Termos.

                ## 10. Alterações

                Reservamo-nos o direito de modificar estes Termos. Quando houver alterações materiais, publicaremos a nova versão e solicitaremos seu novo aceite. O uso continuado da Plataforma após a aceitação constitui concordância com os Termos atualizados.

                ## 11. Lei Aplicável e Foro

                Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.

                ## 12. Contato

                Dúvidas sobre estes Termos devem ser enviadas para: **privacidade@vibbe.com.br**
                MD,

            'en' => <<<'MD'
                # Terms and Conditions

                **Version:** 2026-05-17 | **Effective date:** May 17, 2026

                > ⚠️ This is a template. Replace with definitive legal text before going to production.

                ## 1. Parties

                This agreement is entered into between **Vibbe Tecnologia Ltda.** ("Vibbe" or "we"), a Brazilian legal entity registered under CNPJ 00.000.000/0001-00, and the **User** ("you"), an individual who registers on the Vibbe Backstage platform.

                ## 2. Acceptance

                By creating an account or using the platform, you confirm that you have read, understood, and agreed to these Terms and our [Privacy Policy](/privacy-policy). If you disagree, do not use the platform.

                ## 3. Object

                Vibbe offers a management and collaboration platform ("Platform") accessible upon registration. Vibbe may modify, suspend, or discontinue features at any time with reasonable advance notice.

                ## 4. Account Registration and Security

                4.1. You must provide accurate information and keep it up to date.

                4.2. You are responsible for maintaining the confidentiality of your login credentials.

                4.3. Notify us immediately in the event of unauthorized access to your account.

                ## 5. Permitted Use

                5.1. You agree to use the Platform only for lawful purposes and in accordance with these Terms.

                5.2. You may not: (a) violate applicable laws or regulations; (b) transmit illegal, defamatory, or infringing content; (c) attempt to access other users' systems or data; (d) reverse engineer or extract code improperly.

                ## 6. Personal Data (LGPD / GDPR)

                The processing of your personal data is governed by our [Privacy Policy](/privacy-policy), in compliance with the Brazilian General Data Protection Law (LGPD — Law No. 13,709/2018) and, where applicable, the GDPR (EU 2016/679).

                **Your rights:** You may access, rectify, export, or request anonymization of your data at any time under **Settings → Privacy**.

                ## 7. Intellectual Property

                All Platform content (code, design, trademarks, logos) belongs to Vibbe or its licensors and is protected by applicable intellectual property law.

                ## 8. Limitation of Liability

                Vibbe is not liable for indirect, consequential, or loss-of-profit damages arising from the use or inability to use the Platform, to the maximum extent permitted by applicable law.

                ## 9. Term and Termination

                These Terms remain in effect for as long as you maintain an active account. You may close your account at any time under **Settings → Privacy → Delete my account**. Vibbe may suspend or terminate accounts that violate these Terms.

                ## 10. Changes

                We reserve the right to modify these Terms. When material changes occur, we will publish the new version and request your renewed acceptance. Continued use of the Platform constitutes agreement to the updated Terms.

                ## 11. Governing Law and Jurisdiction

                These Terms are governed by the laws of the Federative Republic of Brazil. The courts of São Paulo/SP are designated as the exclusive venue for any disputes.

                ## 12. Contact

                Questions about these Terms should be sent to: **privacy@vibbe.com.br**
                MD,

            'es' => <<<'MD'
                # Términos y Condiciones de Uso

                **Versión:** 2026-05-17 | **Vigencia:** a partir del 17 de mayo de 2026

                > ⚠️ Este es un template. Sustitúyalo por el texto jurídico definitivo antes de ir a producción.

                ## 1. Las Partes

                El presente instrumento se celebra entre **Vibbe Tecnologia Ltda.** ("Vibbe" o "nosotros"), persona jurídica inscrita en el CNPJ bajo el número 00.000.000/0001-00, y el **Usuario** ("usted"), persona física que se registra en la plataforma Vibbe Backstage.

                ## 2. Aceptación

                Al crear una cuenta o utilizar la plataforma, usted declara haber leído, comprendido y aceptado estos Términos y nuestra [Política de Privacidad](/privacy-policy). Si no está de acuerdo, no utilice la plataforma.

                ## 3. Objeto

                Vibbe ofrece una plataforma de gestión y colaboración ("Plataforma") accesible mediante registro. Vibbe puede modificar, suspender o discontinuar funcionalidades en cualquier momento con aviso previo razonable.

                ## 4. Registro y Seguridad de la Cuenta

                4.1. Debe proporcionar información veraz y mantenerla actualizada.

                4.2. Es responsable de mantener la confidencialidad de sus credenciales de acceso.

                4.3. Notifíquenos de inmediato en caso de acceso no autorizado a su cuenta.

                ## 5. Uso Permitido

                5.1. Acepta utilizar la Plataforma únicamente para fines lícitos y de acuerdo con estos Términos.

                5.2. Está prohibido: (a) violar leyes o regulaciones aplicables; (b) transmitir contenido ilegal, difamatorio o que infrinja derechos de terceros; (c) intentar acceder a sistemas o datos de otros usuarios; (d) realizar ingeniería inversa o extracción indebida de código.

                ## 6. Datos Personales (LGPD / RGPD)

                El tratamiento de sus datos personales se rige por nuestra [Política de Privacidad](/privacy-policy), en conformidad con la Ley General de Protección de Datos de Brasil (LGPD — Ley nº 13.709/2018) y, donde corresponda, el RGPD (UE 2016/679).

                **Sus derechos:** Puede acceder, rectificar, exportar o solicitar la anonimización de sus datos en cualquier momento en **Configuración → Privacidad**.

                ## 7. Propiedad Intelectual

                Todo el contenido de la Plataforma (código, diseño, marcas, logotipos) pertenece a Vibbe o a sus licenciantes y está protegido por la legislación de propiedad intelectual vigente.

                ## 8. Limitación de Responsabilidad

                Vibbe no se responsabiliza por daños indirectos, consecuentes o lucro cesante derivados del uso o la imposibilidad de uso de la Plataforma, en la máxima extensión permitida por la legislación aplicable.

                ## 9. Plazo y Rescisión

                Estos Términos están vigentes mientras mantenga una cuenta activa. Puede cerrar su cuenta en cualquier momento en **Configuración → Privacidad → Eliminar mi cuenta**. Vibbe puede suspender o eliminar cuentas que violen estos Términos.

                ## 10. Modificaciones

                Nos reservamos el derecho de modificar estos Términos. Cuando haya cambios materiales, publicaremos la nueva versión y solicitaremos su nueva aceptación. El uso continuado de la Plataforma constituye aceptación de los Términos actualizados.

                ## 11. Ley Aplicable y Fuero

                Estos Términos se rigen por las leyes de la República Federativa de Brasil. Se designan los tribunales de São Paulo/SP como fuero exclusivo para cualquier controversia.

                ## 12. Contacto

                Las consultas sobre estos Términos deben enviarse a: **privacidad@vibbe.com.br**
                MD,
        ];

        foreach ($contents as $locale => $content) {
            TermsAndCondition::updateOrCreate(
                ['slug' => 'terms', 'version' => $version, 'locale' => $locale],
                ['content' => $content, 'published_at' => now()],
            );
        }
    }
}
