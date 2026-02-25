const attachTransaction = (db) => {
    return async (req, res, next) => {
        const transaction = await db.sequelize.transaction();

        req.transaction = transaction;
        req.afterCommit = [];

        const isSwagger = req.headers["x-swagger-request"] === "true";
        let finished = false;
        const cleanup = async () => {
            if (finished) return;
            finished = true;

            try {
                if (isSwagger || res.statusCode >= 400) {
                    await transaction.rollback();
                } else {
                    await transaction.commit();
                    if (req.afterCommit?.length > 0) {
                        Promise.allSettled(req.afterCommit.map(fn => fn()))
                            .catch(err => console.error("AfterCommit error:", err));
                    }
                }
            } catch (err) {
                console.error("Transaction cleanup error:", err);
            }
        };
        res.on("finish", cleanup);
        res.on("close", cleanup);

        next();
    };
};

module.exports = attachTransaction;