import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CreditCard, Smartphone, X, Shield, CheckCircle } from 'lucide-react';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentData: any) => void;
  amount: number;
}

export function PaymentPopup({ isOpen, onClose, onPaymentSuccess, amount }: PaymentPopupProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formData, setFormData] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setPaymentComplete(true);
    
    // Show success for 2 seconds then complete
    setTimeout(() => {
      onPaymentSuccess({
        method: paymentMethod,
        amount: amount,
        ...formData
      });
      onClose();
      setPaymentComplete(false);
    }, 2000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    if (paymentMethod === 'upi') {
      return formData.upiId.length > 0;
    }
    return formData.cardNumber.length >= 16 && 
           formData.expiryDate.length >= 5 && 
           formData.cvv.length >= 3 && 
           formData.cardholderName.length > 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Payment for Profile Access</DialogTitle>
        <DialogDescription className="sr-only">
          Choose your payment method to unlock the full profile
        </DialogDescription>
        
        <AnimatePresence mode="wait">
          {paymentComplete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 360] }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, rotate: { duration: 2, repeat: Infinity, ease: "linear" } }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>
              <motion.h2 
                className="text-3xl text-pink-600 mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ fontWeight: '600' }}
              >
                Payment Successful! 💖
              </motion.h2>
              <motion.p 
                className="text-gray-700 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Unlocking your love story... ✨
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CardHeader className="relative text-center pb-6 bg-pink-50">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-5xl mb-4"
                >
                  💝
                </motion.div>
                
                <h1 className="text-3xl text-pink-600 mb-3" style={{ fontWeight: '600' }}>
                  Unlock Your Love Story
                </h1>
                <div className="text-4xl text-pink-600 mb-3" style={{ fontWeight: '700' }}>₹{amount}</div>
                <p className="text-gray-700 text-base">Discover your perfect match's world ✨</p>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'upi' | 'card')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-2xl p-2">
                    <TabsTrigger 
                      value="upi" 
                      className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-600 rounded-xl py-3 transition-all duration-300"
                      style={{ fontWeight: '500' }}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      UPI
                    </TabsTrigger>
                    <TabsTrigger 
                      value="card"
                      className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-600 rounded-xl py-3 transition-all duration-300"
                      style={{ fontWeight: '500' }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Card
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upi" className="space-y-4 mt-6">
                    <div className="bg-pink-50 rounded-2xl p-5 mb-6 border border-pink-200">
                      <div className="flex justify-center gap-4 mb-4">
                        {/* Google Pay */}
                        <motion.div 
                          className="bg-gradient-to-br from-blue-500 to-green-500 rounded-xl p-3 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-white text-xs font-bold">
                            G Pay
                          </div>
                        </motion.div>
                        
                        {/* PhonePe */}
                        <motion.div 
                          className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-3 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-white text-xs font-bold">
                            PhonePe
                          </div>
                        </motion.div>
                        
                        {/* Paytm */}
                        <motion.div 
                          className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-3 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-white text-xs font-bold">
                            Paytm
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-gray-700 text-sm text-center font-medium">Supported UPI Apps ✨</p>
                    </div>

                    <div>
                      <Label htmlFor="upiId" className="text-gray-700 font-medium">UPI ID or Phone Number</Label>
                      <Input
                        id="upiId"
                        value={formData.upiId}
                        onChange={(e) => updateFormData('upiId', e.target.value)}
                        placeholder="yourname@paytm or 9876543210"
                        className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-2xl focus:border-pink-400 focus:ring-pink-200 mt-3 py-3"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="card" className="space-y-4 mt-6">
                    <div className="bg-pink-50 rounded-2xl p-5 mb-6 border border-pink-200">
                      <div className="flex justify-center gap-6 mb-4">
                        <motion.div 
                          className="text-3xl"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          💳
                        </motion.div>
                        <motion.div 
                          className="text-3xl"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          🏦
                        </motion.div>
                        <motion.div 
                          className="text-3xl"
                          animate={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          🪪
                        </motion.div>
                      </div>
                      <p className="text-gray-700 text-sm text-center font-medium">All Cards Accepted ✨</p>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName" className="text-white/90 elegant-font">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        value={formData.cardholderName}
                        onChange={(e) => updateFormData('cardholderName', e.target.value)}
                        placeholder="John Doe"
                        className="bg-gradient-to-r from-white/25 to-white/15 border-white/30 text-white placeholder:text-white/60 rounded-2xl focus:border-pink-300 focus:ring-2 focus:ring-pink-300/20 mt-3 py-3"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber" className="text-white/90 elegant-font">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => updateFormData('cardNumber', e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="bg-gradient-to-r from-white/25 to-white/15 border-white/30 text-white placeholder:text-white/60 rounded-2xl focus:border-pink-300 focus:ring-2 focus:ring-pink-300/20 mt-3 py-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiryDate" className="text-white/90 elegant-font">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            updateFormData('expiryDate', value);
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="bg-gradient-to-r from-white/25 to-white/15 border-white/30 text-white placeholder:text-white/60 rounded-2xl focus:border-pink-300 focus:ring-2 focus:ring-pink-300/20 mt-3 py-3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-white/90 elegant-font">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => updateFormData('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                          className="bg-gradient-to-r from-white/25 to-white/15 border-white/30 text-white placeholder:text-white/60 rounded-2xl focus:border-pink-300 focus:ring-2 focus:ring-pink-300/20 mt-3 py-3"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePayment}
                      disabled={!isFormValid() || isProcessing}
                      className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-pink-600 text-white rounded-full py-4 text-lg shadow-2xl disabled:opacity-50 heartbeat ripple-effect"
                      style={{ 
                        boxShadow: '0 8px 25px rgba(255, 182, 193, 0.4)',
                        background: 'linear-gradient(45deg, #FFB6C1, #DDA0DD, #FFB6C1)'
                      }}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div 
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                            style={{ filter: 'drop-shadow(0 0 5px gold)' }}
                          />
                          <span className="cursive-font">Creating Magic...</span>
                        </div>
                      ) : (
                        <motion.span 
                          className="flex items-center justify-center gap-2 cursive-font"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <span style={{ filter: 'drop-shadow(0 0 5px gold)' }}>💖</span>
                          Pay ₹{amount} Now
                          <span style={{ filter: 'drop-shadow(0 0 5px gold)' }}>💖</span>
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Security Notice */}
                <motion.div 
                  className="flex items-center justify-center gap-3 mt-6 p-4 bg-gradient-to-r from-white/15 to-white/10 rounded-2xl border border-white/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Shield className="w-5 h-5 text-green-400" style={{ filter: 'drop-shadow(0 0 5px green)' }} />
                  </motion.div>
                  <p className="text-white/80 text-sm elegant-font">
                    Secure payment powered by Razorpay ✨
                  </p>
                </motion.div>

                {/* Features List */}
                <div className="mt-6 p-5 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20">
                  <p className="text-white/80 text-sm mb-4 text-center elegant-font">Your romantic journey includes:</p>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-3 text-white/90">
                      <span style={{ color: '#FFD700', filter: 'drop-shadow(0 0 3px gold)' }}>✨</span>
                      <span>Complete photo gallery access</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <span style={{ color: '#C0C0C0', filter: 'drop-shadow(0 0 3px silver)' }}>💫</span>
                      <span>Instagram handle & social profiles</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <span style={{ color: '#FFD700', filter: 'drop-shadow(0 0 3px gold)' }}>🌟</span>
                      <span>Direct connection capability</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}