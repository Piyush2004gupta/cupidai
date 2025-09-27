import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { X } from 'lucide-react';

interface SignUpFormProps {
  onSignIn: () => void;
}

export function SignUpForm({ onSignIn }: SignUpFormProps) {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    skinColor: '',
    instagram: '',
    interests: [] as string[],
    partnerSkinColor: '',
    partnerAgeRange: [20, 26] as [number, number],
    partnerHeightRange: '5-5.5 ft',
    partnerInterests: '',
  });

  const [newInterest, setNewInterest] = useState('');

  const heightOptions = [
    '4-4.5 ft', '4.5-5 ft', '5-5.5 ft', '5.5-6 ft', '6+ ft'
  ];

  const skinColorOptions = [
    'Fair', 'Wheatish', 'Brown', 'Dark', 'Does not matter'
  ];

  const ageRanges = [
    { label: '18-20', value: [18, 20] },
    { label: '20-23', value: [20, 23] },
    { label: '23-26', value: [23, 26] },
    { label: '26-30', value: [26, 30] },
    { label: 'Does not matter', value: [18, 50] },
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
              💞 Create Your Profile
            </motion.h1>

            {/* Gender Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs value={selectedGender} onValueChange={(value) => setSelectedGender(value as 'male' | 'female')}>
                <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm">
                  <TabsTrigger value="female" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
                    💖 Female
                  </TabsTrigger>
                  <TabsTrigger value="male" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
                    💙 Male
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {/* Personal Details Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-4">
                <h3 className="text-white text-lg mb-3">✨ Personal Details</h3>
                
                <div>
                  <Label htmlFor="fullName" className="text-white/90">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white/90">Email / Mobile</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="password" className="text-white/90">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-white/90">Confirm</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="age" className="text-white/90">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateFormData('age', e.target.value)}
                      placeholder="25"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-white/90">Height</Label>
                    <Select value={formData.height} onValueChange={(value) => updateFormData('height', value)}>
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

                <div>
                  <Label className="text-white/90">Skin Color</Label>
                  <Select value={formData.skinColor} onValueChange={(value) => updateFormData('skinColor', value)}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white rounded-xl">
                      <SelectValue placeholder="Select skin color" />
                    </SelectTrigger>
                    <SelectContent>
                      {skinColorOptions.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interests" className="text-white/90">Hobbies / Interests</Label>
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
                  <Label htmlFor="instagram" className="text-white/90">Instagram ID (Optional)</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => updateFormData('instagram', e.target.value)}
                    placeholder="@yourhandle"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  />
                </div>
              </div>

              {/* Partner Preferences Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-4">
                <h3 className="text-white text-lg mb-3">💕 Partner Preferences</h3>
                
                <div>
                  <Label className="text-white/90">Preferred Skin Color</Label>
                  <Select value={formData.partnerSkinColor} onValueChange={(value) => updateFormData('partnerSkinColor', value)}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white rounded-xl">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {skinColorOptions.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/90">Age Range</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {ageRanges.map((range, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={JSON.stringify(formData.partnerAgeRange) === JSON.stringify(range.value) ? "default" : "outline"}
                        onClick={() => updateFormData('partnerAgeRange', range.value)}
                        className="rounded-xl text-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                        size="sm"
                      >
                        {range.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-white/90">Height Preference</Label>
                  <Select value={formData.partnerHeightRange} onValueChange={(value) => updateFormData('partnerHeightRange', value)}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white rounded-xl">
                      <SelectValue placeholder="Select height range" />
                    </SelectTrigger>
                    <SelectContent>
                      {heightOptions.map((height) => (
                        <SelectItem key={height} value={height}>{height}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="partnerInterests" className="text-white/90">Preferred Interests</Label>
                  <Input
                    id="partnerInterests"
                    value={formData.partnerInterests}
                    onChange={(e) => updateFormData('partnerInterests', e.target.value)}
                    placeholder="Sports, Music, Travel, etc."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:border-pink-300"
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-4">
                <h3 className="text-white text-lg mb-3">💳 Payment</h3>
                <div className="text-center">
                  <div className="text-3xl text-white mb-2">₹50</div>
                  <p className="text-white/80 text-sm mb-4">One-time registration fee</p>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full py-3 text-lg shadow-2xl">
                    Continue → 
                  </Button>
                </div>
              </div>
            </motion.div>

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