import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { verificationAPI } from '../utils/firebase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Phone, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OTPVerificationProps {
  mobile: string;
  onVerified: () => void;
  onBack: () => void;
}

export function OTPVerification({ mobile = '', onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsVerifying(true);
    
    try {
      const result = await verificationAPI.verifyOTP(mobile, otpString);
      
      if (result.success) {
        toast.success('Mobile number verified successfully! 🎉');
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else {
        throw new Error(result.error || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    
    // Simulate resending OTP
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('New OTP sent successfully! 📱');
      setTimeLeft(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatMobile = (mobile: string) => {
    if (mobile.length === 10) {
      return `${mobile.slice(0, 2)}****${mobile.slice(-2)}`;
    }
    return mobile;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB3C1 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border-0 shadow-2xl rounded-3xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center"
            >
              <div className="text-3xl">📱</div>
            </motion.div>
            
            <div>
              <CardTitle className="text-2xl text-pink-600 mb-2" style={{ fontWeight: '600' }}>
                Verify Your Number
              </CardTitle>
              <CardDescription className="text-gray-600">
                We've sent a 6-digit code to +91 {formatMobile(mobile)}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl bg-gray-50 border-gray-200 text-gray-700 focus:border-pink-400 focus:ring-pink-200 rounded-xl"
                  maxLength={1}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otp.some(d => !d)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white disabled:bg-pink-300 rounded-full py-3 text-lg"
              style={{ fontWeight: '600' }}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              ) : (
                <>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mr-2"
                  >
                    💖
                  </motion.span>
                  Verify OTP
                </>
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-gray-600 text-sm">
                  Resend OTP in {timeLeft}s
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                >
                  {isResending ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
              )}
            </div>

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full text-gray-600 hover:text-pink-600 hover:bg-pink-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Button>
          </CardContent>
        </Card>

        {/* Helper Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
        >
          <p className="text-white/80 text-sm">
            💡 For demo: Enter any 6-digit code to verify
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}