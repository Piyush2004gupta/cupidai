import { useState } from 'react';
import { motion } from 'motion/react';
import { authAPI } from '../utils/firebase/client';
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

  // Pre-sorted comprehensive list of Indian cities for better performance
  const indianCities = [
    'Abohar', 'Adilabad', 'Agartala', 'Agra', 'Ahmednagar', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Akola', 'Akot',
    'Alibag', 'Aligarh', 'Alappuzha', 'Allahabad', 'Alwar', 'Amalner', 'Ambernath', 'Ambattur', 'Ambikapur', 'Amravati',
    'Amritsar', 'Amroha', 'Anantapur', 'Arrah', 'Asansol', 'Aurangabad', 'Avadi',
    'Bagalkot', 'Balurghat', 'Bally', 'Bangalore', 'Baranagar', 'Barabanki', 'Bardhaman', 'Bareilly', 'Bathinda',
    'Begusarai', 'Behrampur', 'Belgaum', 'Bellary', 'Berhampur', 'Bettiah', 'Bhagalpur', 'Bharatpur', 'Bharuch',
    'Bhatpara', 'Bhavnagar', 'Bhilai', 'Bhilwara', 'Bhind', 'Bhopal', 'Bhubaneswar', 'Bhusawal', 'Bhiwandi',
    'Bihar Sharif', 'Bikaner', 'Bilaspur', 'Bijapur', 'Bishnupur', 'Bokaro',
    'Chandigarh', 'Chandrapur', 'Chennai', 'Chittaurgarh', 'Chittoor', 'Coimbatore', 'Cuttack',
    'Darbhanga', 'Davanagere', 'Dehradun', 'Delhi', 'Dewas', 'Dhanbad', 'Dhule', 'Dibrugarh', 'Didwana',
    'Dimapur', 'Dindigul', 'Durg', 'Durgapur',
    'Eluru', 'Erode', 'Etawah',
    'Faridabad', 'Farrukhabad', 'Firozabad',
    'Gadag-Betigeri', 'Gandhidham', 'Gaya', 'Ghaziabad', 'Gobindgarh', 'Gopalpur', 'Gopalganj', 'Gorakhpur',
    'Gudivada', 'Gulbarga', 'Guna', 'Guntakal', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior',
    'Haldia', 'Hapur', 'Hazaribagh', 'Hindupur', 'Hospet', 'Howrah', 'Hubballi-Dharwad', 'Hyderabad',
    'Ichalkaranji', 'Imphal', 'Indore',
    'Jabalpur', 'Jagdalpur', 'Jagtial', 'Jaipur', 'Jalgaon', 'Jalandhar', 'Jalna', 'Jamnagar', 'Jamshedpur',
    'Jammu', 'Jetpur', 'Jhansi', 'Jind', 'Jodhpur', 'Junagadh',
    'Kadapa', 'Kadiri', 'Kaithal', 'Kakinada', 'Kalyan-Dombivali', 'Kamarhati', 'Kanpur', 'Karaikudi', 'Karnal',
    'Karimnagar', 'Khammam', 'Khanna', 'Kharagpur', 'Khopoli', 'Kirari Suleman Nagar', 'Kishanganj', 'Kochi',
    'Kohima', 'Kolhapur', 'Kolkata', 'Kollam', 'Korba', 'Kota', 'Kottayam', 'Kozhikode', 'Kulti', 'Kumbakonam',
    'Kurnool',
    'Latur', 'Loni', 'Lucknow', 'Ludhiana',
    'Machilipatnam', 'Madanapalle', 'Madhyamgram', 'Madurai', 'Maheshtala', 'Mahbubnagar', 'Malerkotla', 'Malegaon',
    'Mangalore', 'Markapur', 'Mathura', 'Mau', 'Medininagar', 'Meerut', 'Mira-Bhayandar', 'Mirzapur', 'Moga',
    'Morena', 'Morigaon', 'Morvi', 'Mumbai', 'Murwara', 'Muzaffarnagar', 'Muzaffarpur', 'Mysore',
    'Nagercoil', 'Nagaon', 'Nagpur', 'Naihati', 'Nanded', 'Nandyal', 'Narnaul', 'Narasaraopet', 'Nashik',
    'Navsari', 'Navi Mumbai', 'Neemuch', 'Nellore', 'New Delhi', 'Neyveli', 'Nizamabad', 'Nokha', 'Noida',
    'North Dumdum', 'Nuzvid',
    'Ongole', 'Orai', 'Ozhukarai',
    'Palakkad', 'Pali', 'Palitana', 'Palwal', 'Panihati', 'Panipat', 'Parbhani', 'Patan', 'Patiala', 'Patna',
    'Pen', 'Phagwara', 'Pimpri-Chinchwad', 'Proddatur', 'Puducherry', 'Pudukkottai', 'Pune', 'Puri', 'Purnia',
    'Purulia',
    'Raebareli', 'Raichur', 'Raigarh', 'Raiganj', 'Raipur', 'Rajahmundry', 'Rajkot', 'Rajpur Sonarpur', 'Ramagundam',
    'Ramgarh', 'Rampur', 'Ranchi', 'Ratlam', 'Rayagada', 'Rewa', 'Rohtak', 'Rourkela',
    'Sagar', 'Saharsa', 'Saharanpur', 'Salem', 'Sambalpur', 'Sangli-Miraj & Kupwad', 'Satara', 'Satna',
    'Sawantwadi', 'Sehore', 'Shahjahanpur', 'Shillong', 'Shivamogga', 'Shrirampur', 'Siddipet', 'Sikar',
    'Silchar', 'Siliguri', 'Sirsa', 'Siwan', 'Solapur', 'Sonipat', 'South Dumdum', 'Srinagar', 'Srikakulam',
    'Srivilliputhur', 'Supaul', 'Surat', 'Suryapet',
    'Tadepalligudem', 'Tenali', 'Tezpur', 'Thane', 'Thanjavur', 'Thiruvananthapuram', 'Thoothukudi', 'Thrissur',
    'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvottiyur', 'Tinsukia', 'Tonk', 'Tumkur', 'Tuni',
    'Udaipur', 'Udupi', 'Ujjain', 'Ulhasnagar', 'Unnao',
    'Vadodara', 'Varanasi', 'Vasai-Virar', 'Vedaranyam', 'Vellore', 'Veraval', 'Vijayawada', 'Visakhapatnam',
    'Vizianagaram',
    'Wai', 'Warangal', 'Washim'
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

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate mobile number
      if (!/^\d{10}$/.test(formData.mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        setIsLoading(false);
        return;
      }

      // Validate email
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        alert('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Validate age
      const age = parseInt(formData.age);
      if (age < 18 || age > 65) {
        alert('Age must be between 18 and 65');
        setIsLoading(false);
        return;
      }

      // Validate password
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }

      // Sign up user with Firebase
      const signUpResult = await authAPI.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        mobile: formData.mobile,
        gender: selectedGender,
      });

      if (!signUpResult.success) {
        alert(signUpResult.error || 'Sign up failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Sign in the user after successful signup
      const signInResult = await authAPI.signIn(formData.email, formData.password);
      
      if (!signInResult.success) {
        alert('Account created but sign in failed. Please try signing in manually.');
        setIsLoading(false);
        return;
      }

      const profileData = {
        ...formData,
        gender: selectedGender,
        userId: signInResult.user?.id,
      };
      
      onComplete(profileData);
    } catch (error) {
      console.error('Sign up error:', error);
      alert('An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 50%, #FFB3C1 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="bg-white border-0 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-4 relative">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="absolute top-4 left-4 text-pink-600 hover:text-pink-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 mt-2"
            >
              <div className="text-4xl">💖</div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-pink-600 mb-2"
              style={{ fontWeight: '600' }}
            >
              Create Your Profile
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-4 py-2"
            >
              <span className="text-xl">{selectedGender === 'female' ? '👩' : '👨'}</span>
              <span className="text-pink-600 capitalize font-medium">{selectedGender}</span>
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
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="age" className="text-gray-700">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    placeholder="25"
                    className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                    required
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Height</Label>
                  <Select value={formData.height} onValueChange={(value) => updateFormData('height', value)} required>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
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
                  <Label className="text-gray-700">City</Label>
                  <Select value={formData.city} onValueChange={(value) => updateFormData('city', value)} required>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700">Skin Tone</Label>
                  <Select value={formData.skinTone} onValueChange={(value) => updateFormData('skinTone', value)} required>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
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
                <Label htmlFor="interests" className="text-gray-700">Interests & Hobbies</Label>
                <div className="flex gap-2">
                  <Input
                    id="interests"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add your interests..."
                    className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4"
                  >
                    +
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-pink-100 text-pink-700 hover:bg-pink-200"
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
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-gray-700">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => updateFormData('mobile', e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  maxLength={10}
                  className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                  required
                />
              </div>

              <div>
                <Label htmlFor="instagram" className="text-gray-700">Instagram ID (Optional)</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => updateFormData('instagram', e.target.value)}
                  placeholder="@yourhandle"
                  className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Create a secure password"
                  className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                  required
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-3 text-lg shadow-lg disabled:opacity-70"
                  style={{ fontWeight: '600' }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
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
                      Send OTP for Verification
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2"
                      >
                        ✨
                      </motion.span>
                    </>
                  )}
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
                className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Already have an account? <span className="text-pink-600 font-medium underline">Sign in 💫</span>
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}