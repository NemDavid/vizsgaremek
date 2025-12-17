const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_PostService {
    constructor(db, user_profileService) {
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.user_profileService = user_profileService;
        this.db = db;
    }

    async getUser_Posts() {
        return await this.user_postRepository.getUser_Posts();
    }

    async getUser_PostsByLimit(page, perpage) {
        if (page === undefined || perpage === undefined) {
            throw new BadRequestError("hiányzó Adatok");
        }

        return await this.user_postRepository.getUser_PostsByLimit(page, perpage);
    }

    async getUser_Posts_ByuserId(userId) {
        return await this.user_postRepository.getUser_Posts_ByuserId(userId);
    }

    async getUser_Post_ByID(postId) {
        return await this.user_postRepository.getUser_Post_ByID(postId);
    }

    async deleteUser_Post(postId) {
        if (!postId) {
            throw new BadRequestError("hiányzó post ID");
        }

        const deleteProcess = await this.user_postRepository.deleteUser_Post(postId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen id-vel post");
        }
        return deleteProcess;
    }

    async createUser_Post(postData) {
        const encodedToken = authUtils.verifyToken(postData.token);
        postData.USER_ID = encodedToken.userID;



        if (!postData.USER_ID) {
            throw new BadRequestError("hiányzó USER_ID");
        }
        if (!postData.title) {
            throw new BadRequestError("hiányzó title");
        }
        if (!postData.content) {
            throw new BadRequestError("hiányzó content");
        }
        if (!postData.token) {
            throw new BadRequestError("hiányzó token");
        }

        const validUser = await this.userRepository.getUser(postData.USER_ID);
        if (!validUser) {
            throw new BadRequestError("nincs ilyen felhasználó");
        }

        // EGY transaction a teljes műveletre
        const transaction = await this.db.sequelize.transaction();

        try {
            // add xp
            await this.user_profileService.addXPToUser(postData.USER_ID,
                100,
                transaction
            );

            const newPost = await this.user_postRepository.createUser_Post(postData,
                {
                    transaction
                }
            );

            await transaction.commit();
            return newPost;
        } catch (error) {
            // Valami hibázott -> rollback
            await transaction.rollback();
            console.error("Reaction transaction error:", error);
            throw error;
        }
    }

    async updateUser_Post(postId, updateData) {
        if (!postId) throw new BadRequestError("Hiányzó post ID");
        if (!updateData.USER_ID) {
            throw new BadRequestError("hiányzó USER_ID");
        }
        if (!updateData.like) {
            throw new BadRequestError("hiányzó like");
        }
        if (!updateData.dislike) {
            throw new BadRequestError("hiányzó dislike");
        }
        if (!updateData.content) {
            throw new BadRequestError("hiányzó content");
        }
        if (!updateData.media_url) {
            throw new BadRequestError("hiányzó media_url");
        }
        if (!updateData.visibility) {
            throw new BadRequestError("hiányzó visibility");
        }


        const validUser = await this.userRepository.getUser(updateData.USER_ID);
        if (!validUser) {
            throw new BadRequestError("nincs ilyen felhasználó");
        }

        const affectedRows = await this.user_postRepository.updateUser_Post(postId, updateData);

        if (!affectedRows) {
            throw new BadRequestError("post nem található", { details: `postId: ${postId}` })
        }

        const updateUser_Post = await this.user_postRepository.getUser_Post_ByID(postId);

        if (!updateUser_Post) {
            throw new BadRequestError("a frissitett post nem található", { details: `postId: ${postId}` });
        }
        return updateUser_Post;
    }

}

module.exports = User_PostService;