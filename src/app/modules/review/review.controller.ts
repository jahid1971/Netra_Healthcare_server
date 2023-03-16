import catchAsync from "../../utls/catchAsync";
import sendSuccessResponse from "../../utls/sendSuccessResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
    const result = await ReviewService.createReview(req.user, req.body);

    sendSuccessResponse(res, result, "Review created successfully", 201);
});

const getReviews = catchAsync(async (req, res) => {
    const result = await ReviewService.getReviews(req.query);

    sendSuccessResponse(res, result, "Reviews fetched successfully");
})

export const ReviewController = {
    createReview,
    getReviews
}