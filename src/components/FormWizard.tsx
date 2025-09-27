import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';

interface FormWizardProps {
  selectedGender: 'male' | 'female';
  onComplete: () => void;
  onBack: () => void;
}

export function FormWizard({ selectedGender, onComplete, onBack }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    interests: '',
    instagram: '',
    ageRange: [25, 35],
    heightRange: [160, 180],
    partnerInterests: '',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderProgressHearts = () => (
    <div className="flex justify-center items-center gap-4 mb-8">
      {[1, 2, 3].map((step) => (
        <motion.div
          key={step}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
            step <= currentStep 
              ? 'bg-gradient-to-r from-pink-400 to-red-400 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-400'
          }`}
          animate={{ scale: step === currentStep ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {step <= currentStep ? '💝' : '🤍'}
        </motion.div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter your name"
          className="rounded-xl"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => updateFormData('age', e.target.value)}
            placeholder="25"
            className="rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => updateFormData('height', e.target.value)}
            placeholder="170"
            className="rounded-xl"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="interests">Your Interests</Label>
        <Textarea
          id="interests"
          value={formData.interests}
          onChange={(e) => updateFormData('interests', e.target.value)}
          placeholder="Tell us about your hobbies, passions, and what makes you unique..."
          className="rounded-xl"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
        <Input
          id="instagram"
          value={formData.instagram}
          onChange={(e) => updateFormData('instagram', e.target.value)}
          placeholder="@yourhandle"
          className="rounded-xl"
        />
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <Label>Preferred Age Range</Label>
        <div className="px-3 py-4">
          <Slider
            value={formData.ageRange}
            onValueChange={(value) => updateFormData('ageRange', value)}
            max={60}
            min={18}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{formData.ageRange[0]} years</span>
            <span>{formData.ageRange[1]} years</span>
          </div>
        </div>
      </div>
      
      <div>
        <Label>Preferred Height Range (cm)</Label>
        <div className="px-3 py-4">
          <Slider
            value={formData.heightRange}
            onValueChange={(value) => updateFormData('heightRange', value)}
            max={200}
            min={150}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{formData.heightRange[0]} cm</span>
            <span>{formData.heightRange[1]} cm</span>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="partnerInterests">What interests would you like them to have?</Label>
        <Textarea
          id="partnerInterests"
          value={formData.partnerInterests}
          onChange={(e) => updateFormData('partnerInterests', e.target.value)}
          placeholder="Describe the interests and qualities you're looking for in a partner..."
          className="rounded-xl"
          rows={4}
        />
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-6 text-center"
    >
      <div className="text-6xl mb-4">💳</div>
      <h3 className="text-xl mb-2">Ready to find your match?</h3>
      <p className="text-gray-600 mb-6">Our AI cupid will find your perfect match based on your preferences</p>
      
      <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl p-6 mb-6">
        <div className="text-3xl mb-2">✨ Premium Match</div>
        <div className="text-2xl mb-1">$9.99</div>
        <div className="text-sm text-gray-600">AI-powered perfect match + chat</div>
      </div>
      
      <div className="space-y-3">
        <Button className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3">
          Pay with Card 💳
        </Button>
        <Button variant="outline" className="w-full rounded-xl py-3">
          Scan QR Code 📱
        </Button>
      </div>
    </motion.div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Tell us about yourself";
      case 2: return "Your ideal match";
      case 3: return "Complete your profile";
      default: return "";
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border-0">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {getStepTitle()}
        </CardTitle>
        {renderProgressHearts()}
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            className="flex-1 rounded-xl"
          >
            ← Back
          </Button>
          <Button
            onClick={nextStep}
            className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
          >
            {currentStep === 3 ? 'Find Match! 💕' : 'Next →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}