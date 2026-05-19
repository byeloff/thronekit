@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block; text-decoration: none; color: #18181b;">
    <table cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
            <td style="vertical-align: middle; padding-right: 10px;">
                <span style="display: inline-block; width: 32px; height: 32px; border-radius: 7px; background-color: #18181b; text-align: center; line-height: 32px; font-size: 14px; font-weight: 700; color: #ffffff;">{{ mb_strtoupper(mb_substr(config('app.name'), 0, 1)) }}</span>
            </td>
            <td style="vertical-align: middle; font-size: 19px; font-weight: 700; color: #18181b; letter-spacing: -0.3px;">
                {{ config('app.name') }}
            </td>
        </tr>
    </table>
</a>
</td>
</tr>
