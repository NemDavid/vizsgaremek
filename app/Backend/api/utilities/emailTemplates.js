exports.loginNotificationTemplate = (username) => {
    const message = `Sikeresen bejelentkeztél a fiókodba.
        Ha nem te voltál, kérjük, azonnal változtasd meg a jelszavad!
        Vagy lépj kapcsolatba az ügyfélszolgálatunkkal.`.trim();

    const text = `Szia ${username}!\n\n${message}`;
    const html = `
    <p>Szia <strong>${username}</strong>!</p>
    <p>${message}</p>
  `;
    return { text, html };
};

exports.newPostNotificationTemplate = (username) => {
    const message = `Az egyik barátod új bejegyzést tett közzé.
    Nézd meg, mi történt!`;

    const text = `Szia ${username}!\n\n${message}`;
    const html = `
        <p>Szia <strong>${username}</strong>!</p>
        <p>${message}</p>
    `;
    return { text, html };
};


exports.newReactionNotificationTemplate = (username) => {
    const message = `Valaki reagált az egyik bejegyzésedre.
    Nézd meg, mit reagált!`;

    const text = `Szia ${username}!\n\n${message}`;
    const html = `
        <p>Szia <strong>${username}</strong>!</p>
        <p>${message}</p>
    `;
    return { text, html };
};


exports.newCommentNotificationTemplate = (username) => {
    const message = `Valaki hozzászólt az egyik bejegyzésedhez.
    Nézd meg, mit szólt!`;

    const text = `Szia ${username}!\n\n${message}`;
    const html = `
        <p>Szia <strong>${username}</strong>!</p>
        <p>${message}</p>
    `;
    return { text, html };
};


exports.newFriendRequestNotificationTemplate = (username) => {
    const message = `Új barátjelölést kaptál.
    Döntsd el, hogy elfogadod vagy elutasítod!`;

    const text = `Szia ${username}!\n\n${message}`;
    const html = `
        <p>Szia <strong>${username}</strong>!</p>
        <p>${message}</p>
    `;
    return { text, html };
};

exports.registrationConfirmTemplate = (username, confirmUrl) => {
    const text = `Szia ${username}, erősítsd meg a regisztrációd itt: ${confirmUrl}`;
    const html = `
            <p>Szia <strong>${username}</strong>!</p>
            <p>Kérjük, erősítsd meg a regisztrációdat az alábbi linkre kattintva:</p>
            <a href="${confirmUrl}">👉 Fiók aktiválása</a>
            <p>A link 30 percig érvényes.</p>
        `;

    return { text, html };
}

exports.passwordResetVerifyCodeTemplate = (verify_code) => {
    const text = `Kérlek használd a következő kódot a jelszavad visszaállításához: ${verify_code}.`;
    const html = `
        <p>Kérlek, használd a következő ellenőrző kódot a jelszavad visszaállításához:</p>
        <p><strong style="font-size: 1.2em;">${verify_code}</strong></p>
    `;

    return { text, html };
}
