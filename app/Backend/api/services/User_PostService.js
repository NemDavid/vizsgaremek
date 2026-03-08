const { BadRequestError, ValidationError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_PostService {
    constructor(db, user_profileService) {
        this.user_postRepository =
            require("../repositories")(db).user_postRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.user_profileService = user_profileService;
        this.notificationService = null;
    }

    setNotificationService(notificationService) {
        this.notificationService = notificationService;
    }

    async getUser_Posts(transaction) {
        return await this.user_postRepository.getUser_Posts({ transaction });
    }

    async getUser_PostsByLimit(page, perpage, transaction) {
        if (!Number.isInteger(page) || !Number.isInteger(perpage)) {
            throw new BadRequestError("Hiányzó Adatok");
        }
        if (page < 0 || perpage < 0) {
            throw new ValidationError("Rossz adatok");
        }
        return await this.user_postRepository.getUser_PostsByLimit(page, perpage, { transaction });
    }

    async getUser_Posts_ByuserId(userId, transaction) {
        const validUser = await this.userRepository.getUser(userId, { transaction });
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }
        return await this.user_postRepository.getUser_Posts_ByuserId(userId, { transaction });
    }

    async getUser_Post_ByID(postId, transaction) {
        return await this.user_postRepository.getUser_Post_ByID(postId, { transaction });
    }

    async deleteUser_Post(encodedToken, postId, transaction) {
        if (!postId) {
            throw new BadRequestError("Hiányzó post ID");
        }

        const existingPost = await this.user_postRepository.getUser_Post_ByID(postId, { transaction });
        if (!existingPost) {
            throw new BadRequestError("Nincs ilyen post");
        }
        if (encodedToken.role == "user" && existingPost.USER_ID != encodedToken.userID) {
            throw new BadRequestError("Ez nem a te posztod");
        }

        const deleteProcess = await this.user_postRepository.deleteUser_Post(postId, { transaction });

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Sikertelen törlés");
        }

        return deleteProcess;
    }

    async createUser_Post(postData, transaction, req) {
        postData.USER_ID = postData.user.userID;

        // validate
        if (!postData.title) {
            throw new BadRequestError("Hiányzó cim");
        }
        if (!authUtils.isValidPostTittle(postData.title)) {
            throw new ValidationError("A cím 3 és 255 karakter között lehet");
        }
        if (!postData.content) {
            throw new BadRequestError("hiányzó content");
        }
        if (!authUtils.isValidPostContent(postData.content)) {
            throw new ValidationError("A tartalom 3 és 1000 karakter között lehet");
        }

        const validUser = await this.userRepository.getUser(postData.USER_ID, { transaction });
        if (!validUser) {
            throw new ValidationError("Nincs ilyen felhasználó");
        }

        // add xp
        await this.user_profileService.addXPToUser(
            postData.USER_ID,
            100,
            transaction,
        );

        const newPost = await this.user_postRepository.createUser_Post(
            postData,
            {
                transaction,
            },
        );

        //  email a baratoknak transaction utan
        if (req.afterCommit && this.notificationService) {
            req.afterCommit.push(async () => {
                await this.notificationService
                    .sendNotificationToFriends(validUser, "new_post")
                    .catch(console.error);
            });
        }
        
        return newPost;

    }
    async updatePost(encodedToken, postId, newdata, transaction) {
        const validUser = await this.userRepository.getUser(encodedToken.userID, { transaction });
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }
        if (!postId) throw new BadRequestError("Hiányzó post ID");

        const existingPost = await this.user_postRepository.getUser_Post_ByID(postId, { transaction });
        if (!existingPost) {
            throw new BadRequestError("Nincs ilyen post");
        }
        if (existingPost.USER_ID != encodedToken.userID) {
            throw new BadRequestError("Ez nem a te posztod");
        }

        if (!newdata.content && !newdata.title) {
            throw new BadRequestError("Hiányzó adat");
        }

        const affectedRows = await this.user_postRepository.updateUser_Post(
            postId,
            newdata,
            { transaction },
        );
        if (!affectedRows) {
            throw new BadRequestError("Post nem található", {
                details: `postId: ${postId}`,
            });
        }

        const updateUser_Post = await this.user_postRepository.getUser_Post_ByID(postId, { transaction });

        if (!updateUser_Post) {
            throw new BadRequestError("A frissitett post nem található", {
                details: `postId: ${postId}`,
            });
        }
        return updateUser_Post;
    }

    async updateUser_Post(postId, updateData, transaction) {
        if (!postId) throw new BadRequestError("Hiányzó post ID");
        if (!updateData.USER_ID) {
            throw new BadRequestError("Hiányzó USER_ID");
        }
        if (!updateData.like) {
            throw new BadRequestError("Hiányzó like");
        }
        if (!updateData.dislike) {
            throw new BadRequestError("Hiányzó dislike");
        }
        if (!updateData.content) {
            throw new BadRequestError("Hiányzó content");
        }
        if (!updateData.media_url) {
            throw new BadRequestError("Hiányzó media_url");
        }
        if (!updateData.visibility) {
            throw new BadRequestError("Hiányzó visibility");
        }

        const validUser = await this.userRepository.getUser(updateData.USER_ID, { transaction });
        if (!validUser) {
            throw new BadRequestError("nincs ilyen felhasználó");
        }

        const affectedRows = await this.user_postRepository.updateUser_Post(
            postId,
            updateData,
            { transaction },
        );

        if (!affectedRows) {
            throw new BadRequestError("post nem található", {
                details: `postId: ${postId}`,
            });
        }

        const updateUser_Post =
            await this.user_postRepository.getUser_Post_ByID(postId, { transaction });

        if (!updateUser_Post) {
            throw new BadRequestError("a frissitett post nem található", {
                details: `postId: ${postId}`,
            });
        }
        return updateUser_Post;
    }
}

module.exports = User_PostService;
