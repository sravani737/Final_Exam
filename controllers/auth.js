const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/userSchema');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP and expiration time in the database
    user.resetOtp = otp;
    user.resetOtpExpiration = Date.now() + 3600000; // OTP valid for 1 hour
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is <strong>${otp}</strong>. It is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpiration: { $gt: Date.now() }, // Ensure OTP is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined; // Clear the OTP
    user.resetOtpExpiration = undefined; // Clear the expiration time
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
