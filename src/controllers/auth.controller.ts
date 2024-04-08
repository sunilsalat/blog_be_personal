import { Request, Response } from "express";
import { BadRequest } from "../errors";
import { DaOtp, DaToken, DaUser } from "../dataAccess";
import { CommonClass } from "../services/common";
import { sendOTPEmail } from "../services/mailer";
const common = new CommonClass();

export const register = async (req: Request, res: Response) => {
    let data = req.body;
    let user = null;
    user = await DaUser.read({ email: data.email });
    if (!user) {
        /*
        1 - registering user if not registerd
        */
        user = await DaUser.create(data);
    }

    if (user) {
        const randNum = common.generateRandom4Digit();
        /*
          1 - generate otp and store in db to verify later
          2 - send otp to user
          3 - checkAndSendOtp checks spoofing before sending otp
        */
        const otpObj = await DaOtp.create({
            userId: user._id,
            email: user.email,
            OTP: randNum,
            expiresAt: Date.now() + Number(process.env.OTP_EXPIRATION_TIME!),
        });

        //  await sendOTPEmail({ to: user.email, otp: randNum })

        return res.status(200).json({
            data: null,
            msg: "Registration successful",
        });
    }

    return res.status(200).json({ data: "", msg: "" });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userObj: any = await DaUser.read({ email });
    if (!userObj || !userObj.matchPassword(password)) {
        throw new BadRequest("Please provide valid credentials");
    }

    const tokenObj: any = await DaToken.readOrCreate({
        user: userObj,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });

    if (!tokenObj.isValid) {
        throw new BadRequest("Something went wrong!");
    }

    common.createJwtTokenAndAttachCookieToRes({
        res,
        payload: { role: userObj.role, userId: userObj._id },
        refreshTokenDb: tokenObj.refreshTokenDB,
    });

    return res.status(200).json({
        data: { name: userObj.name, role: userObj.role },
        msg: "Login successful",
    });
};

export const verifyOtpAndGrantAccess = async (req: Request, res: Response) => {
    const { secret, otp } = req.body;
    let userId = null;

    try {
        const decoded: any = common.verifyPayload(secret);
        userId = decoded.userId;
        /*
        1 - OTP attempts should be less than allowable attempts
        2 - OTP should not get verified after it expires
        3 - Once OTP is used, Mark it invalid in database
        */

        const userObj = await DaUser.read({ _id: userId });
        if (!userObj) {
            throw new BadRequest("Something went wrong!");
        }

        const otpObj = await DaOtp.read({ userId: userId }, { createdAt: -1 });
        if (!otpObj || !otpObj.isValid) {
            throw new BadRequest("Something went wrong!");
        }

        if (
            otpObj.attempts > Number(process.env.ALLOWABLE_OTP_VERIFY_ATTEMPTS)
        ) {
            throw new BadRequest("Something went wrong!");
        }

        if (Date.now() > Number(otpObj.expiresAt)) {
            throw new BadRequest("Otp expired");
        }

        if (Number(otpObj.OTP) !== Number(otp)) {
            otpObj.attempts = otpObj.attempts + 1;
            await otpObj.save();
            throw new BadRequest("Wrong OTP");
        }

        /*
          1 - Generate JWT and grant access
       */
        const tokenObj: any = await DaToken.readOrCreate({
            user: userObj,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        if (!tokenObj.isValid) {
            throw new BadRequest("Something went wrong!");
        }

        common.createJwtTokenAndAttachCookieToRes({
            res,
            payload: { role: userObj.role, userId: userObj._id },
            refreshTokenDb: tokenObj.refreshTokenDB,
        });

        otpObj.isValid = false;
        await otpObj.save();
        return res.status(200).json({ data: true, msg: "" });
    } catch (error) {
        throw new BadRequest("Something went wrong!");
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const data = req.body;
    const filter = {};
    const obj = await DaUser.update(filter, data);
    return res.status(200).json({ data: true, msg: "User updated" });
};

export const findUser = async (req: Request, res: Response) => {
    const data = req.body;
    const filter = {};
    const obj = await DaUser.read(filter);
    return res.status(200).json({ data: obj, msg: "" });
};

export const findAllUser = async (req: Request, res: Response) => {
    const data = req.body;
    const filter = {};
    const obj = await DaUser.readAll(filter);
    return res.status(200).json({ data: obj, msg: "" });
};

export const logout = async (req: Request, res: Response) => {
    res.cookie("access_token", "", {
        path: "/",
        httpOnly: true,
        secure: false,
        expires: new Date(Number(Date.now)),
        maxAge: 1,
        signed: true,
        sameSite: "lax",
    });

    res.cookie("refresh_token", "", {
        path: "/",
        httpOnly: true,
        secure: false,
        expires: new Date(Number(Date.now)),
        maxAge: 1,
        signed: true,
        sameSite: "lax",
    });

    res.status(200).json({ data: null, msg: "logout" });
};
