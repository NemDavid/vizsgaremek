const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User_Profiles extends Model {

        // XP hozzáadása a felhasználóhoz
        async addXP(amount) {
            if (amount == null || isNaN(amount)) {
                throw new Error(`Érvénytelen XP érték: ${amount}`);
            }

            const transaction = await sequelize.transaction();

            console.log(`[XP] Starting for user ${this.USER_ID}, amount: ${amount}`);

            try {
                // Reload with lock
                await this.reload({
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });

                const XP_PER_LEVEL = 1000;
                const currentXP = Number(this.XP) || 0;
                const currentLevel = Number(this.level) || 1;
                const addAmount = Number(amount);

                // Calculate
                const totalXPBefore = (currentLevel - 1) * XP_PER_LEVEL + currentXP;
                const totalXPAfter = totalXPBefore + addAmount;
                const newLevel = Math.min(Math.floor(totalXPAfter / XP_PER_LEVEL) + 1, 50);
                const newXP = totalXPAfter % XP_PER_LEVEL;

                const levelUps = newLevel - currentLevel;

                // Update
                this.XP = newXP;
                this.level = newLevel;

                console.log(`[XP] ${this.USER_ID}: ${totalXPBefore} -> ${totalXPAfter} XP, Level: ${currentLevel} -> ${newLevel}`);

                // Save with transaction
                await this.save({ transaction });

                // Commit
                await transaction.commit();

                console.log(`[XP] Completed for user ${this.USER_ID}`);

                return {
                    success: true,
                    level: this.level,
                    xp: this.XP,
                    totalXP: totalXPAfter,
                    levelUps: levelUps,
                    xpAdded: addAmount
                };

            } catch (err) {
                await transaction.rollback();
                console.error(`[XP ERROR] User ${this.USER_ID}, amount ${amount}:`, err.message);

                // Rethrow with better message
                if (err.name === 'SequelizeDatabaseError') {
                    throw new Error(`Database error: ${err.message}`);
                }
                throw err;
            }
        }

        /**
         * Get total XP (all levels)
         */
        getTotalXP() {
            const XP_PER_LEVEL = 1000;
            const currentXP = Number(this.XP) || 0;
            const currentLevel = Number(this.level) || 1;
            return (currentLevel - 1) * XP_PER_LEVEL + currentXP;
        }

        /**
         * XP progress percentage
         */
        getXPProgress() {
            const XP_PER_LEVEL = 1000;
            const currentXP = Number(this.XP) || 0;
            return Math.min(100, Math.round((currentXP / XP_PER_LEVEL) * 100));
        }

        /**
         * XP needed for next level
         */
        getXPNeededForNextLevel() {
            const XP_PER_LEVEL = 1000;
            const currentXP = Number(this.XP) || 0;
            return XP_PER_LEVEL - currentXP;
        }
    }

    User_Profiles.init(
{
            ID:
            {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            USER_ID:
            {
                type: DataTypes.BIGINT,
                unique: true,
                allowNull: false
            },

            level:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },

            XP:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            first_name:
            {
                type: DataTypes.STRING(50),
                allowNull: false
            },

            last_name:
            {
                type: DataTypes.STRING(50),
                allowNull: false
            },

            birth_date:
            {
                type: DataTypes.DATEONLY,
                allowNull: true
            },

            birth_place:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            schools:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            bio:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            avatar_url:
            {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: "/dpfp.png"
            },
        },

        {
            sequelize,
            modelName: "User_Profiles",
            freezeTableName: true,
            createdAt: false,
            updatedAt: false,
            scopes: {
                allUser_ProfileData: {
                    attributes: [
                        "ID", 
                        "USER_ID", 
                        "level", 
                        "XP", 
                        "first_name", 
                        "last_name", 
                        "birth_date",
                        "birth_place", 
                        "schools", 
                        "bio", 
                        "avatar_url"
                    ],
                }
            }
        });

    /**
     * Safety hook - only validate, don't throw
     */
    User_Profiles.beforeSave((user) => {
        // Safely convert and validate
        const xp = Number(user.XP);
        const level = Number(user.level);

        // Fix if invalid
        if (isNaN(xp) || xp < 0) {
            user.XP = 0;
        } else if (xp > 999) {
            user.XP = 999;
        } else {
            user.XP = xp;
        }

        if (isNaN(level) || level < 1) {
            user.level = 1;
        } else if (level > 50) {
            user.level = 50;
        } else {
            user.level = level;
        }
    });

    // Static helper method
    // User_Profiles.addXPToUser = async function (userId, amount) {
    //     const profile = await this.findOne({ where: { USER_ID: userId } });
    //     if (!profile) {
    //         throw new Error(`User profile not found: ${userId}`);
    //     }
    //     return await profile.addXP(amount);
    // };

    return User_Profiles;
};