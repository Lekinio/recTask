import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const verifyJwtToken = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["auth"];
    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
        req.body.user = jwtPayload;
    } catch (error) {
        res.status(401).send('Unauthorized');
        return;
    }
    next();
};