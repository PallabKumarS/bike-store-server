import { Request, Response } from 'express';
import { BikeService } from './bike.service';
import { bikeValidationSchema } from './bike.validation';

// create bike
const createBike = async (req: Request, res: Response) => {
  try {
    const { bike } = req.body;
    const {
      //  error,
      value,
    } = bikeValidationSchema.validate(bike);

    // error handling
    // if (error) {
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Validation failed',
    //     error: error.details,
    //   });
    // }

    const result = await BikeService.createBikeIntoDB(value);
    res.status(200).json({
      success: true,
      message: 'Bike is created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
};

// get all bikes
const getAllBike = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string;
    const result = searchTerm
      ? await BikeService.getBikeBySearchTerm(searchTerm)
      : await BikeService.getAllBikesFromDB();
    res.status(200).json({
      message: 'Bicycles are retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
};

// get single bike
const getSingleBike = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const result = await BikeService.getSingleBikeFromDB(id);
    res.status(200).json({
      success: true,
      message: 'Bike is retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
};

// update bike
const updateBike = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const { bike } = req.body;
    const result = await BikeService.updateBikeIntoDB(id, bike);
    res.status(200).json({
      success: true,
      message: 'Bike is retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
};

// delete bike
const deleteBike = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const result = await BikeService.deleteBikeFromDB(id);
    res.status(200).json({
      success: true,
      message: 'Bike is retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    // return res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
};

export const BikeController = {
  createBike,
  getAllBike,
  getSingleBike,
  updateBike,
  deleteBike,
};
