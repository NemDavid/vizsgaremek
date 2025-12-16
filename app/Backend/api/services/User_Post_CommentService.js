const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_Post_CommentService {
    constructor(db, user_profileService) {
        this.user_post_CommentRepository = require("../repositories")(db).user_post_commentRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        this.user_profileService = user_profileService;
    }

    async getUsers_posts_comments() {
        return await this.user_post_CommentRepository.getUsers_posts_comments();
    }

    async getUsers_posts_comment(itemId) {  
        return await this.user_post_CommentRepository.getUsers_posts_comment(itemId);
    }

    async deleteUsers_posts_comment(itemId) {
        if (!itemId) {
            throw new BadRequestError("hiányzó item ID");
        }

        const deleteProcess = await this.user_post_CommentRepository.deleteUsers_posts_comment(itemId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen user post comment");
        }
        return deleteProcess;
    }

    async createUsers_posts_comment(commentData, token) {
        const encodedToken = authUtils.verifyToken(token);
        commentData.USER_ID = encodedToken.userID;

        if (!commentData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!commentData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!commentData.comment) {
            throw new BadRequestError("Hiányzó user comment");
        }

        // letezik e a post amire commentet akarok adni
        const targetPost = await this.user_postRepository.getUser_Post_ByID(commentData.POST_ID);
        if (!targetPost) {
            throw new BadRequestError("a cel post nem található");
        }

        // add xp
        await this.user_profileService.addXPToUser(commentData.USER_ID, 50);

        return await this.user_post_CommentRepository.createUsers_posts_comment(commentData);
    }

    async updateUsers_posts_comment(commentData, token) {
        const encodedToken = authUtils.verifyToken(token);
        commentData.USER_ID = encodedToken.userID;

        if (!commentData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!commentData.ID) {
            throw new BadRequestError("Hiányzó item id");
        }
        if (!commentData.comment) {
            throw new BadRequestError("Hiányzó user comment");
        }

        const updatedComment = await this.user_post_CommentRepository.updateUsers_posts_comment(commentData);
        if (!updatedComment) {
            throw new BadRequestError("a frissített comment nem található");
        }

        return updatedComment;
    }
}

module.exports = User_Post_CommentService;