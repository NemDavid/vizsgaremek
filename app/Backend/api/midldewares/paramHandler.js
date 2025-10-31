function paramPage(req, res, next, paramPage) {
    req.paramPage = paramPage;
    next();
}

function paramUserId(req, res, next, userId) {
    req.userId = userId;
    next();
}

module.exports = { paramPage, paramUserId }