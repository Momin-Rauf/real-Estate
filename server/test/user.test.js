import { updateUser, deleteUser, logout, getUserListing } from "../controller/user.controller.js";
import bcryptjs from "bcryptjs";

// Mocking the models

jest.mock("bcryptjs", () => ({
    hashSync: jest.fn(),
}));

jest.mock("../models/user.model.js", () => ({
    __esModule: true,
    default: {
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    },
}));

jest.mock("../models/listing.model.js", () => ({
    __esModule: true,
    default: {
        find: jest.fn(),
    },
}));

bcryptjs.hashSync.mockReturnValueOnce("hashedPassword");

const mockReq = {
    user: { id: "mockUserID" },
    params: { id: "mockUserID" },
    body: {
        username: "newUsername",
        email: "new@example.com",
        password: "newPassword",
        photo: "newPhotoURL",
    },
};

const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    clearCookie: jest.fn(),
};

describe("Update User API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update user successfully", async () => {
        const User = require("../models/user.model.js").default;
        User.findByIdAndUpdate.mockResolvedValueOnce({ _doc: { ...mockReq.body } });
        bcryptjs.hashSync.mockReturnValueOnce("hashedPassword");
        await updateUser(mockReq, mockRes);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith("mockUserID", {
            $set: {
                username: "newUsername",
                email: "new@example.com",
                password: "hashedPassword",
                photo: "newPhotoURL",
            },
        }, { new: true });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            username: "newUsername",
            email: "new@example.com",
            photo: "newPhotoURL",
        });
    });

    it("should handle error while updating user", async () => {
        const User = require("../models/user.model.js").default;
        const mockError = new Error("Mock Error");
        User.findByIdAndUpdate.mockRejectedValueOnce(mockError);

        await updateUser(mockReq, mockRes);

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith("mockUserID", {
            $set: {
                username: "newUsername",
                email: "new@example.com",
                password: "hashedPassword",
                photo: "newPhotoURL",
            },
        }, { new: true });
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Mock Error" });
    });
});

describe("Delete User API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete user successfully", async () => {
        const User = require("../models/user.model.js").default;
        User.findByIdAndDelete.mockResolvedValueOnce({ _doc: {} });
        await deleteUser(mockReq, mockRes);
        expect(User.findByIdAndDelete).toHaveBeenCalledWith("mockUserID");
        expect(mockRes.clearCookie).toHaveBeenCalledWith("access_token");
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith("User has been deleted");
    });

    it("should handle error while deleting user", async () => {
        const User = require("../models/user.model.js").default;
        const mockError = new Error("Mock Error");
        User.findByIdAndDelete.mockRejectedValueOnce(mockError);

        await deleteUser(mockReq, mockRes);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith("mockUserID");
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Mock Error" });
    });
});

describe("Logout API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should logout user successfully", async () => {
        await logout(mockReq, mockRes);
        expect(mockRes.clearCookie).toHaveBeenCalledWith("access_token");
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith("logged out");
    });

    it("should handle error during logout", async () => {
        const mockError = new Error("Mock Error");
        mockRes.clearCookie.mockImplementationOnce(() => { throw mockError; });

        await logout(mockReq, mockRes);

        expect(mockRes.clearCookie).toHaveBeenCalledWith("access_token");
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Mock Error" });
    });
});

describe("Get User Listing API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should get user listing successfully", async () => {
        const listing = require("../models/listing.model.js").default;
        const mockListings = [{ title: "Mock Listing 1" }, { title: "Mock Listing 2" }];
        listing.find.mockResolvedValueOnce(mockListings);

        await getUserListing(mockReq, mockRes);

        expect(listing.find).toHaveBeenCalledWith({ useRef: "mockUserID" });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockListings);
    });

    it("should handle error while getting user listing", async () => {
        const listing = require("../models/listing.model.js").default;
        const mockError = new Error("Mock Error");
        listing.find.mockRejectedValueOnce(mockError);

        await getUserListing(mockReq, mockRes);

        expect(listing.find).toHaveBeenCalledWith({ useRef: "mockUserID" });
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Mock Error" });
    });

    it("should handle invalid user ID", async () => {
        const invalidMockReq = { ...mockReq, params: { id: "invalidUserID" } };

        await getUserListing(invalidMockReq, mockRes);

        expect(require("../models/listing.model.js").default.find).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "only view your lists" });
    });

    it("should handle empty user listing", async () => {
        const listing = require("../models/listing.model.js").default;
        listing.find.mockResolvedValueOnce([]);

        await getUserListing(mockReq, mockRes);

        expect(listing.find).toHaveBeenCalledWith({ useRef: "mockUserID" });
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it("should handle unexpected error while getting user listing", async () => {
        const listing = require("../models/listing.model.js").default;
        const mockError = new Error("Unexpected Error");
        listing.find.mockRejectedValueOnce(mockError);

        await getUserListing(mockReq, mockRes);

        expect(listing.find).toHaveBeenCalledWith({ useRef: "mockUserID" });
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "Unexpected Error" });
    });
});
