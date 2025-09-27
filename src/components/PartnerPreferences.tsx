import { useState } from 'react';
import { motion } from 'motion/react';
import { profileAPI } from '../utils/firebase/client';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { ArrowLeft } from 'lucide-react';

interface PartnerPreferencesProps {
  userProfile: any;
  onComplete: (preferences: any) => void;
  onBack: () => void;
}

export function PartnerPreferences({ userProfile = {}, onComplete, onBack }: PartnerPreferencesProps) {
  const [preferences, setPreferences] = useState({
    ageRange: [20, 26] as [number, number],
    heightRange: '',
    skinTone: '',
    interests: '',
    lookingFor: '',
  });

  const heightOptions = [
    '4-4.5 ft', '4.5-5 ft', '5-5.5 ft', '5.5-6 ft', '6+ ft', "Doesn't matter"
  ];

  const skinToneOptions = [
    'Fair', 'Light', 'Medium', 'Olive', 'Brown', 'Dark', "Doesn't matter"
  ];

  const updatePreferences = (field: string, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user profile with preferences
      const updatedProfile = {
        ...userProfile,
        partnerAgeRange: preferences.ageRange,
        partnerHeightRange: preferences.heightRange,
        partnerSkinTone: preferences.skinTone,
        partnerInterests: preferences.interests,
        lookingFor: preferences.lookingFor,
      };

      const result = await profileAPI.updateProfile(updatedProfile);
      
      if (result.success) {
        onComplete(preferences);
      } else {
        alert(result.error || 'Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('An error occurred while saving preferences. Please try again.');
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
              <div className="text-4xl">💕</div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-pink-600 mb-2"
              style={{ fontWeight: '600' }}
            >
              Partner Preferences
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-sm"
            >
              Help AI Cupid find your perfect match
            </motion.p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Age Range */}
              <div className="bg-pink-50 rounded-2xl p-4 space-y-4">
                <h3 className="text-pink-600 text-lg font-medium">💫 Age Preference</h3>
                
                <div>
                  <Label className="text-gray-700">
                    Age Range: {preferences.ageRange[0]} - {preferences.ageRange[1]} years
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={preferences.ageRange}
                      onValueChange={(value) => updatePreferences('ageRange', value as [number, number])}
                      max={50}
                      min={18}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>18</span>
                    <span>50</span>
                  </div>
                </div>
              </div>

              {/* Physical Preferences */}
              <div className="bg-pink-50 rounded-2xl p-4 space-y-4">
                <h3 className="text-pink-600 text-lg font-medium">✨ Physical Preferences</h3>
                
                <div>
                  <Label className="text-gray-700">Height Preference</Label>
                  <Select value={preferences.heightRange} onValueChange={(value) => updatePreferences('heightRange', value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
                      <SelectValue placeholder="Select height preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {heightOptions.map((height) => (
                        <SelectItem key={height} value={height}>{height}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700">Skin Tone Preference</Label>
                  <Select value={preferences.skinTone} onValueChange={(value) => updatePreferences('skinTone', value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-700 rounded-xl">
                      <SelectValue placeholder="Select skin tone preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {skinToneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Interests & About */}
              <div className="bg-pink-50 rounded-2xl p-4 space-y-4">
                <h3 className="text-pink-600 text-lg font-medium">💘 Personality & Interests</h3>
                
                <div>
                  <Label htmlFor="interests" className="text-gray-700">Preferred Interests</Label>
                  <Input
                    id="interests"
                    value={preferences.interests}
                    onChange={(e) => updatePreferences('interests', e.target.value)}
                    placeholder="Sports, Music, Travel, Reading..."
                    className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200"
                  />
                </div>

                <div>
                  <Label htmlFor="aboutMe" className="text-gray-700">What are you looking for in your partner?</Label>
                  <Textarea
                    id="aboutMe"
                    value={preferences.lookingFor}
                    onChange={(e) => updatePreferences('lookingFor', e.target.value)}
                    placeholder="Describe what you're looking for in your ideal partner... their personality, values, interests..."
                    className="bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 rounded-xl focus:border-pink-400 focus:ring-pink-200 min-h-[100px] resize-none"
                    maxLength={300}
                  />
                  <div className="text-right text-gray-500 text-xs mt-1">
                    {preferences.lookingFor.length}/300
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-3 text-lg shadow-lg"
                  style={{ fontWeight: '600' }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mr-2"
                  >
                    💖
                  </motion.span>
                  Find My Perfect Match
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2"
                  >
                    ✨
                  </motion.span>
                </Button>
              </motion.div>
            </motion.form>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <div className="flex justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-3 h-3 bg-pink-200 rounded-full"></div>
              </div>
              <p className="text-gray-500 text-xs">Step 2 of 3</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}