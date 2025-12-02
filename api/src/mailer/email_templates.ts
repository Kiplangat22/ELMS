import { verify } from "crypto";

export const emailTemplate = {
    welcome: (first_name: string) => `
    <div>
        <h2>Welcome ${first_name}!</h2>
        <p>Thank you for registering with us. We're excited to have you on board!</p>
        <P>You deserve the best in our organization.</P>
    </div>
    `,
    //verification email template
    verify: (first_name: string, code: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hello ${first_name}!</h2>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>Please enter this code in the app to verify your email address.</p>
        <br />
        <p> Thank you,<br/>Devs Team lead by wyclif!</p>
    </div>
    `,
    //email template for successful verification
    verifiedSuccess: (first_name: string) => `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Hello ${first_name},</h2>
      <p> Your account has been verified successfully!</p>
      <p>You can now log in and continue experincing seamless designs .</p>
      <br/>
      <p> Thank you,<br/>The Devs Team</p>
    </div>
  `


}