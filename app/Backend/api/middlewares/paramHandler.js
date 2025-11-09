
function paramPage(req, res, next, paramPage) {
    req.paramPage = paramPage;
    next();
}

function paramUserId(req, res, next, userId) {
    req.userId = userId;
    next();
}

function paramPostId(req, res, next, postId) {
    req.postId = postId;
    next();
}

function paramItemId(req, res, next, itemId) {
    req.itemId = itemId;
    next();
}

module.exports = { paramPage, paramUserId, paramPostId, paramItemId };