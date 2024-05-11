import {
    create,
    deleteListing,
    updateListing,
    getListing,
    getListings,
  } from "../controller/list.controller.js";
  import listing from "../models/listing.model.js";
  
  jest.mock("../models/listing.model.js");
  
  const mockReq = {
    user: { id: "mockUserID" },
    params: { id: "mockListingID" },
    body: {
      name: "New Listing",
      description: "A new listing",
      address: "New Address",
      regularPrice: 100,
      discountPrice: 80,
      bathrooms: 2,
      bedrooms: 3,
      furnished: true,
      parking: true,
      offer: true,
      type: "rent",
      useRef: "mockUserID",
      imageUrls: ["image1.jpg", "image2.jpg"],
    },
    query: {},
  };
  
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  describe("Create Listing API", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should create listing successfully", async () => {
      listing.mockReturnValueOnce({
        save: jest.fn().mockResolvedValue(),
      });
  
      await create(mockReq, mockRes);
  
      expect(listing).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith("list added");
    });
  
    it("should handle minimum valid values", async () => {
      const minMockReq = {
        ...mockReq,
        body: {
          ...mockReq.body,
          regularPrice: Number.MIN_SAFE_INTEGER,
          discountPrice: Number.MIN_SAFE_INTEGER,
          bathrooms: 1,
          bedrooms: 1,
        },
      };
  
      await create(minMockReq, mockRes);
  
      expect(listing).toHaveBeenCalledWith(minMockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith("list added");
    });
  
    it("should handle maximum valid values", async () => {
      const maxMockReq = {
        ...mockReq,
        body: {
          ...mockReq.body,
          regularPrice: Number.MAX_SAFE_INTEGER,
          discountPrice: Number.MAX_SAFE_INTEGER,
          bathrooms: Number.MAX_SAFE_INTEGER,
          bedrooms: Number.MAX_SAFE_INTEGER,
        },
      };
  
      await create(maxMockReq, mockRes);
  
      expect(listing).toHaveBeenCalledWith(maxMockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith("list added");
    });
  
  });
  
  describe("Delete Listing API", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should delete listing successfully", async () => {
      listing.findById.mockResolvedValueOnce(mockReq.body);
  
      await deleteListing(mockReq, mockRes);
  
      expect(listing.findById).toHaveBeenCalledWith(mockReq.params.id);
      expect(listing.findByIdAndDelete).toHaveBeenCalledWith(mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith("Listing has been deleted!");
    });
    
    // Add boundary test cases for deleteListing if needed
  });
  
  describe("Update Listing API", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should update listing successfully", async () => {
      const updatedListing = { ...mockReq.body, _id: "mockListingID" };
      listing.findById.mockResolvedValueOnce(updatedListing);
      listing.findByIdAndUpdate.mockResolvedValueOnce(updatedListing);
  
      await updateListing(mockReq, mockRes);
  
      expect(listing.findById).toHaveBeenCalledWith(mockReq.params.id);
      expect(listing.findByIdAndUpdate).toHaveBeenCalledWith(
        mockReq.params.id,
        mockReq.body,
        { new: true }
      );
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  
  });
  
  