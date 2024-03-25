export const otpVerification = async (otpTime,otpExpMinutes) => {
    try {
        console.log("otpTime", otpTime);

        const cDateTime = new Date().getTime();
        const TimeDF = ((otpTime - cDateTime) / 1000) / 60;
        const minutes = Math.abs(TimeDF); //convert minus value to positive
        console.log("DF", TimeDF);

        if (minutes > otpExpMinutes) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
    }

}