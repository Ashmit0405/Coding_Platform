import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

const checkadmin = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Person is not admin");
    }

    next();
});

export { checkadmin };
