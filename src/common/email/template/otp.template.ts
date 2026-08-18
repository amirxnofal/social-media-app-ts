export const otpEmailTemplate = (otp: string): string => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>OTP Verification</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#0a0a0f;" bgcolor="#0a0a0f">

  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Your Social Media verification code is ready — expires in 5 minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0f; padding: 40px 16px;" bgcolor="#0a0a0f">
    <tr>
      <td align="center">

        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px; width:100%; background-color:#15151f; border-radius:16px;" bgcolor="#15151f">

          <!-- Top accent bar -->
          <tr>
            <td style="background-color:#6366f1; height:4px; line-height:4px; font-size:0; border-radius:16px 16px 0 0;" bgcolor="#6366f1">&nbsp;</td>
          </tr>

          <!-- Brand name -->
          <tr>
            <td style="padding:32px 40px 0 40px; text-align:center;">
              <span style="font-size:18px; font-weight:800; color:#a5b4fc; font-family: Arial, Helvetica, sans-serif; letter-spacing:0.5px;">
                Social Media
              </span>
            </td>
          </tr>

          <!-- Header icon -->
          <tr>
            <td style="padding:24px 40px 0 40px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="width:56px; height:56px; background-color:#6366f1; border-radius:14px; text-align:center; vertical-align:middle; font-size:26px;" bgcolor="#6366f1">
                    🔒
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding: 24px 40px 8px 40px; text-align:center;">
              <h1 style="margin:0; font-size:22px; font-weight:700; color:#f4f4f6; font-family: Arial, Helvetica, sans-serif;">
                Verify your identity
              </h1>
            </td>
          </tr>

          <!-- Subtitle -->
          <tr>
            <td style="padding: 0 40px 32px 40px; text-align:center;">
              <p style="margin:0; font-size:14px; line-height:1.6; color:#9494a8; font-family: Arial, Helvetica, sans-serif;">
                Enter the code below to verify your account and start connecting with your community.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1e1e2b; border-radius:12px;" bgcolor="#1e1e2b">
                <tr>
                  <td style="padding:24px; text-align:center; border:1px solid #2e2e42; border-radius:12px;">
                    <span style="font-size:36px; font-weight:700; letter-spacing:10px; color:#a5b4fc; font-family: 'Courier New', Courier, monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Expiry note -->
          <tr>
            <td style="padding: 20px 40px 0 40px; text-align:center;">
              <p style="margin:0; font-size:13px; color:#6b6b80; font-family: Arial, Helvetica, sans-serif;">
                ⏱ This code expires in <strong style="color:#9494a8;">5 minutes</strong>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:1px; background-color:#26263a; font-size:0; line-height:0;" bgcolor="#26263a">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer note -->
          <tr>
            <td style="padding: 24px 40px 36px 40px; text-align:center;">
              <p style="margin:0; font-size:12px; line-height:1.6; color:#5a5a6e; font-family: Arial, Helvetica, sans-serif;">
                If you didn't request this code, you can safely ignore this email.<br />
                Never share this code with anyone.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom brand -->
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px; width:100%;">
          <tr>
            <td style="padding:24px 0; text-align:center;">
              <p style="margin:0; font-size:12px; color:#4a4a5c; font-family: Arial, Helvetica, sans-serif;">
                © 2026 Social Media — All rights reserved
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>

`;
