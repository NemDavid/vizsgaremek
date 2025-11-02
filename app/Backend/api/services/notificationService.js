const emailUtil = require('../utilities/email');

exports.sendWelcome = async (user) => {
  try {
    // Dev módban csak logoljuk, ne küldjünk emailt
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Welcome email to ${user.email}`);
      return;
    }

    await emailUtil.sendWelcomeEmail(user);
  } catch (err) {
    // Email hiba nem akadályozza a regisztrációt
    console.error('Hiba a welcome email küldésénél:', err);
  }
};

// ÚJ: e-mail aktiválás
exports.sendRegistrationConfirm = async (user, confirmUrl) => {
  try {
    const subject = 'MiHirunk - Regisztráció megerősítése';
    const html = `
      <p>Szia <strong>${user.username}</strong>!</p>
      <p>Kérjük, erősítsd meg a regisztrációdat az alábbi linkre kattintva:</p>
      <a href="${confirmUrl}">👉 Fiók aktiválása</a>
      <p>A link 15 percig érvényes.</p>
    `;
    const text = `Szia ${user.username}, erősítsd meg a regisztrációd itt: ${confirmUrl}`;

    await emailUtil.sendMail({ to: user.email, subject, text, html });
  } catch (err) {
    console.error("Hiba az aktiváló email küldésénél:", err);
  }
};
