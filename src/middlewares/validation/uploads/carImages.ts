import { RequestHandler } from "express";
import { matchedData, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import Car from "../../../knex/models/Car";
import CarImage from "../../../knex/models/CarImage";
import { validationResults } from "../utils";

const carImagesParamsExistence: RequestHandler = async (req, res, next) => {
    const { carId, imageId } = matchedData(req);

    const queriedCar = await Car.query()
        .where({
            id: carId,
            deletedAt: null
        })
        .first();
    
    if (!queriedCar) return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Car is not found '});

    if (imageId) {
        const queriedImage = await CarImage.query()
        .where({
            id: imageId
        })

        if (!queriedImage) return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Image is not found' });
    }

    next()
};

const carImagesCount: RequestHandler = async (req, res, next) => {
    const { carId } = matchedData(req);

    const carImages = await CarImage.query()
        .where({
            carId,
        });
    
    if (carImages.length > 10) return res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: `Max images limit is reached for car ${carId}` });

    next();
};

export default {
    validationResults,
    carImagesParamsExistence,
    carImagesCount
}