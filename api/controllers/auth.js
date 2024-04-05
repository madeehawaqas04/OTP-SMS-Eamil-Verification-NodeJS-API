import userModel from "../models/User.js";
import otpGenerator from "otp-generator";
import {otpVerification} from "../helpers/otpValidate.js"
import twilio from "twilio";
import dotenv from "dotenv";
import nodemailer from "nodemailer"
import validator from 'validator'
dotenv.config();

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNTSID;
const otpExpMinutes = process.env.OTP_EXPMINUTES;

const twilioClient = new twilio(accountSid, authToken);


export const sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) return res.status(400).json({ message: 'Phone Number field is required', success: false })

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


export const sendEmailOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'email field is required', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })


        // const isEmailAlreadyReg = await userModel.findOne({ email })
        // // in register user should not be registered already
        // if (isEmailAlreadyReg) return res.status(400).json({ message: `user with email ${email} already resgistered `, success: false })


        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const cDate = new Date();

        const savedOTP = await userModel.findOneAndUpdate(
            { email },
            { otp, otpExpiration: new Date(cDate.getTime()) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("process.env.SENDER_EMAIL",process.env.SENDER_EMAIL);
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verification',
            html: `<p>Your OTP code is ${otp}</p>`
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err)
            else return null        //console.log(info);
        });

        // res.status(200).json(savedOTP);
        res.status(200).json({
            success: true,
            msg: `OTP sent Successfully!`
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


export const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return res.status(400).json({ message: 'email and otp is required', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })


        const otpData = await userModel.findOne({
            email,
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
