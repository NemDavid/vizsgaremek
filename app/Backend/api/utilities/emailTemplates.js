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


