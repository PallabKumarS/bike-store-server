import { Request, Response } from 'express';
import { BikeService } from './bike.service';

// create bike
const createBike = async (req: Request, res: Response) => {
  try {
    const { bike } = req.body;
    const result = await BikeService.createBikeIntoDB(bike);
    res.status(200).json({
      success: true,
      message: 'Bike is created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

// get all bikes
const getAllBike = async (req: Request, res: Response) => {
  try {
    const result = await BikeService.getAllBikesFromDB();
    res.status(200).json({
      success: true,
      message: 'Bikes are retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
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
  }
};

export const BikeController = {
  createBike,
  getAllBike,
  getSingleBike,
  updateBike,
  deleteBike,
};
