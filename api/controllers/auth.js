import userModel from "../models/User.js";
import otpGenerator from "otp-generator";
import {otpVerification} from "../helpers/otpValidate.js"
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNTSID;
const otpExpMinutes = process.env.OTP_EXPMINUTES;

const twilioClient = new twilio(accountSid, authToken);


export const sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const cDate = new Date();

        const savedOTP = await userModel.findOneAndUpdate(
            { phoneNumber },
            { otp, otpExpiration: new Date(cDate.getTime()) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await twilioClient.messages
            .create({
                body: `Your OTP is:${otp}`,
                from: process.env.TWILIO_PHONENO,
                to: phoneNumber //+923343860758 //only verified phoneno for testing
            });

        // res.status(200).json(savedOTP);
        res.status(200).json({
            success: true,
            msg: `OTP sent Successfully! ${otp}`
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }

};

export const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        const otpData = await userModel.findOne({
            phoneNumber,
            otp
        });

        if (!otpData) {
            res.status(200).json({
                success: false,
                msg: "You enter wrong OTP!"
            });
        }
        else {
            const isOTPExpired =await otpVerification(otpData.otpExpiration,otpExpMinutes);

            if (isOTPExpired) {
                res.status(400).json({
                    success: true,
                    msg: `Your OTP has been expired!`
                });
            }
            else {
                res.status(200).json({
                    success: true,
                    msg: `OTP verified successfully!`
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }

};