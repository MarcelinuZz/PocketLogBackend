import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL || "projeksoptware@gmail.com",
        pass: process.env.SMTP_PASSWORD || "utft wfbd fshe wdlk"
    }
});

const actionLabels = {
    change_password: 'Ubah Password',
    change_email: 'Ubah Email',
    delete_account: 'Hapus Akun',
    verify_email: 'Verifikasi Email'
};

export async function sendOTPEmail(toEmail, otpCode, actionType) {
    const actionLabel = actionLabels[actionType] || actionType;

    const mailOptions = {
        from: `"PocketLog" <${process.env.SMTP_EMAIL}>`,
        to: toEmail,
        subject: `[PocketLog] Kode OTP untuk ${actionLabel}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
                <div style="background: linear-gradient(135deg, #6C63FF, #4834DF); padding: 32px 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">PocketLog</h1>
                    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Verifikasi Keamanan Akun</p>
                </div>
                <div style="padding: 32px 24px;">
                    <p style="color: #333; font-size: 15px; margin: 0 0 8px;">Halo,</p>
                    <p style="color: #333; font-size: 15px; margin: 0 0 24px;">
                        Anda meminta untuk <strong>${actionLabel}</strong>. Gunakan kode OTP berikut untuk melanjutkan:
                    </p>
                    <div style="background: #F8F7FF; border: 2px dashed #6C63FF; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 24px;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4834DF;">${otpCode}</span>
                    </div>
                    <p style="color: #888; font-size: 13px; margin: 0 0 8px;">⏱️ Kode ini berlaku selama <strong>5 menit</strong>.</p>
                    <p style="color: #888; font-size: 13px; margin: 0;">Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini dan pastikan akun Anda aman.</p>
                </div>
                <div style="background: #F5F5F5; padding: 16px 24px; text-align: center;">
                    <p style="color: #aaa; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} PocketLog. All rights reserved.</p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}
