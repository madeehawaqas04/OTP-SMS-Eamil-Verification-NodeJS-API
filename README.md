# OTP-SMSVerification-NodeJSAPI
MongoDB, Nodejs, Expressjs, twilio, otp-generator


1- SendOTP API

API URL= http://localhost:8800/api/auth/sendOTP

Body
{
    "phoneNumber":"+923337102659"
}

2- verifyOTP

API URL=http://localhost:8800/api/auth/verifyOTP

{
    "phoneNumber":"+923337102659",
    "otp":"z1xj20"
}


1- Send EmailOTP API

API URL= http://localhost:8800/api/auth/sendEmailOTP

Body
{
    "email":"abc@yahoo.com"
}

2- verify EmailOTP

API URL=http://localhost:8800/api/auth/verifyEmailOTP

{
    "email":"abc@yahoo.com",
    "otp":"z1xj20"
}


In https://myaccount.google.com/security, do you see 2-step verification set to ON? If yes, then visiting https://myaccount.google.com/apppasswords should allow you to set up application specific passwords. 