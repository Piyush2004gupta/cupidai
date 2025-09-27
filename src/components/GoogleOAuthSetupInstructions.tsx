import { motion } from 'motion/react';
import { X, ExternalLink, Settings, Key, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';

interface GoogleOAuthSetupInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleOAuthSetupInstructions({ isOpen, onClose }: GoogleOAuthSetupInstructionsProps) {
  if (!isOpen) return null;

  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white border-0 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-4 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="text-2xl text-pink-600 mb-2" style={{ fontWeight: '600' }}>
              Google Sign-In Setup Required
            </h2>
            <p className="text-gray-600">
              Follow these steps to enable Google authentication
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h3 className="text-yellow-800 mb-1" style={{ fontWeight: '600' }}>Setup Required</h3>
                  <p className="text-yellow-700 text-sm">
                    Google sign-in needs to be configured in your Firebase Console before it can be used.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg text-gray-800" style={{ fontWeight: '600' }}>Setup Instructions:</h3>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600" style={{ fontWeight: '600' }}>
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <h4 className="text-gray-800" style={{ fontWeight: '600' }}>Go to Firebase Console</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Open your Firebase Console and navigate to Authentication → Sign-in method
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => window.open('https://console.firebase.google.com', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Firebase Console
                    </Button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600" style={{ fontWeight: '600' }}>
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-gray-600" />
                      <h4 className="text-gray-800" style={{ fontWeight: '600' }}>Enable Google Provider</h4>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Enable the Google sign-in provider and configure your OAuth 2.0 client
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600" style={{ fontWeight: '600' }}>
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <h4 className="text-gray-800" style={{ fontWeight: '600' }}>Set Redirect URL</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Add this redirect URL to your Google OAuth configuration:
                    </p>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <code className="text-sm text-blue-600 break-all">{redirectUrl}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="text-blue-800 mb-1" style={{ fontWeight: '600' }}>Need Help?</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Follow the detailed setup guide from Supabase for complete instructions.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => window.open('https://supabase.com/docs/guides/auth/social-login/auth-google', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Setup Guide
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white rounded-full py-3"
                style={{ fontWeight: '600' }}
              >
                Got it! 👍
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}