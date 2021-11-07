import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator'
import UserModal from "../models/user.js";
import LoginModal from "../models/loginUsers.js"
import nodemailer from 'nodemailer';
import user from "../models/user.js";

const secret = `${process.env.secret_key}`;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'quickshare56@gmail.com',
    pass: 'Quick30101997'
  }
});

export const requestOtp = async (req, res) => {
  const op = otpGenerator.generate(4, { alphabets: false, digits: true, upperCase: false, specialChars: false });
  // console.log(op);
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });
    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${req.body.email}`,
      subject: `QuickShare Email Verification`,
      html: `<p>Hi,</p> <p> Your OTP for verifying email on QuickShare is ${op}.</p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(401).send("This email id doesn't exist,try with another")
      } else {
        res.status(200).send(op);
        console.log('Email sent: ' + info.response);
      }
    });

  }
  catch (error) {
    res.status(401).send('Something went wrong');
  }


}
export const signin = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // console.log(oldUser.password,password,email);
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (isPasswordCorrect) {
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

      res.status(200).json({ result: oldUser, token });
    }
    else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });


    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });
    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${email}`,
      subject: `Welcome To QuickShare`,
      html: `<p>Hi ${firstName},</p> <p> Thank you for registering on QuickShare.Create memories and start sharing on QuickShare.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ result, token });


  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  // console.log(req.body);
  const email = req.body.email;
  const firstname = req.body.givenName;
  const lastname = req.body.familyName;
  const ind= await LoginModal.findOne({email:req.body.email}).exec();
  // console.log(ind);
  if(!ind){
    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${email}`,
      subject: `Welcome To QuickShare`,
      html: `<p>Hi ${firstname} ${lastname},</p> <p> QuickShare warmly welcomes you.Create memories and start sharing on QuickShare.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  try {
    await LoginModal.create({ firstname, lastname, email, when: Date.now() });
    res.status(201);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const requestOtpLogin = async (req, res) => {
  const op = otpGenerator.generate(4, { alphabets: false, digits: true, upperCase: false, specialChars: false });
  // console.log(req);
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });
    // console.log(oldUser);
    if (!oldUser) return res.status(400).json({ message: "User doesn't exist" });

    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${req.body.email}`,
      subject: `QuickShare Change Password`,
      html: `<p>Hi ${oldUser.name},</p> <p> Your OTP for changing password on QuickShare is ${op}.</p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(401).send("This email id doesn't exist,try with another")
      } else {
        res.status(200).send(op);
        console.log('Email sent: ' + info.response);
      }
    });

  }
  catch (error) {
    res.status(401).send('Something went wrong');
  }
}

export const loginviaOTP = async (req, res) => {
  const op = otpGenerator.generate(4, { alphabets: false, digits: true, upperCase: false, specialChars: false });
  // console.log(req);
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });
    // console.log(oldUser);
    if (!oldUser) return res.status(401).json({ message: "User doesn't exist" });

    var mailOptions = {
      from: 'QuickShare <quickshare56@gmail.com>',
      to: `${req.body.email}`,
      subject: `Login Via OTP`,
      html: `<p>Hi ${oldUser.name},</p> <p>${op} is your QuickShare verification code.</p>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(401).send("This email id doesn't exist,try with another")
      } else {
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
        res.status(200).json({ token, OneTimePassword: op, UserResult: oldUser });
        console.log('Email sent: ' + info.response);
      }
    });

  }
  catch (error) {
    res.status(401).send('Something went wrong');
  }
}

export const changePassword = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    const oldUser = await UserModal.findOne({ email });
    // console.log(oldUser);
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const pass = await bcrypt.hash(password, 12);
    // console.log(password);
    const updatedUser = { email: oldUser.email, name: oldUser.name, password: pass }
    const newUser = await UserModal.findByIdAndUpdate(oldUser._id, updatedUser, { new: true });
    //  console.log(newUser);

    res.status(200).json(newUser);
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};




