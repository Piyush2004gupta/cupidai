import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X, ArrowLeft } from 'lucide-react';

interface SimpleSignUpFormProps {
  selectedGender: 'male' | 'female';
  onSignIn: () => void;
  onComplete: (profileData: any) => void;
  onBack: () => void;
}

export function SimpleSignUpForm({ selectedGender, onSignIn, onComplete, onBack }: SimpleSignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    email: '',
    mobile: '',
    city: '',
    skinTone: '',
    instagram: '',
    password: '',
    interests: [] as string[],
  });

  const [newInterest, setNewInterest] = useState('');

  const heightOptions = [
    '4-4.5 ft', '4.5-5 ft', '5-5.5 ft', '5.5-6 ft', '6+ ft'
  ];

  const skinToneOptions = [
    'Fair', 'Light', 'Medium', 'Olive', 'Brown', 'Dark'
  ];

  const majorCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      updateFormData('interests', [...formData.interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    updateFormData('interests', formData.interests.filter(i => i !== interest));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // Validate email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (age < 18 || age > 65) {
      alert('Age must be between 18 and 65');
      return;
    }

    const profileData = {
      ...formData,
      gender: selectedGender,
    };
    onComplete(profileData);
  };

  return (
    <div className="min-h-screen romantic-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="glass-morphism border-0 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4"
            >
              <div className="relative">
                <div className="text-4xl">💖</div>
                <div className="absolute -top-1 -right-1 text-lg">😇</div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-white mb-2"
            >
              ✨ Create Your Profile
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2"
            >
              <span className="text-2xl">{selectedGender === 'female' ? '👩' : '👨'}</span>
              <span className="text-white capitalize">{selectedGender}</span>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name" className="text-white/90">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="age" className="text-white/90">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    placeholder="25"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white/90">Height</Label>
                  <Select value={formData.height} onValueChange={(value) => updateFormData('height', value)} required>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white rounded-xl">
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent>
                      {heightOptions.map((height) => (
                        <SelectItem key={height} value={height}>{height}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/90">City</Label>
                  <Select value={formData.city} onValueChange={(value) => updateFormData('city', value)} required>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white rounded-xl">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {majorCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/90">Skin Tone</Label>
                  <Select value={formData.skinTone} onValueChange={(value) => updateFormData('skinTone', value)} required>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white rounded-xl">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {skinToneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="interests" className="text-white/90">Interests & Hobbies</Label>
                <div className="flex gap-2">
                  <Input
                    id="interests"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add your interests..."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    className="bg-white/30 hover:bg-white/40 text-white rounded-xl px-4"
                  >
                    +
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/30 text-white hover:bg-white/40"
                    >
                      {interest}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => removeInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-white/90">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-white/90">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => updateFormData('mobile', e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  maxLength={10}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  required
                />
              </div>

              <div>
                <Label htmlFor="instagram" className="text-white/90">Instagram ID (Optional)</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => updateFormData('instagram', e.target.value)}
                  placeholder="@yourhandle"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white/90">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Create a secure password"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  required
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full py-3 text-lg shadow-2xl"
                >
                  Send OTP for Verification ✨
                </Button>
              </motion.div>
            </motion.form>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <button
                onClick={onSignIn}
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                Already have an account? <span className="underline">Sign in 💫</span>
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}