import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User, Calendar, TrendingUp } from 'lucide-react';
import { UserRole } from '@/pages/Index';
import { auth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (role: UserRole, name: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'client' as UserRole,
      title: 'Клиент',
      description: 'Резервирай маникюр с AI прогнози',
      icon: User,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'worker' as UserRole,
      title: 'Маникюрист',
      description: 'Управлявай график и заявки',
      icon: Calendar,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'owner' as UserRole,
      title: 'Собственик',
      description: 'Аналитика и управление на салона',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
    }
  ];

  const validateForm = () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Моля въведете имейл",
        variant: "destructive"
      });
      return false;
    }
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Моля въведете парола",
        variant: "destructive"
      });
      return false;
    }
    if (!isLogin && !name.trim()) {
      toast({
        title: "Error",
        description: "Моля въведете име",
        variant: "destructive"
      });
      return false;
    }
    if (!isLogin && !selectedRole) {
      toast({
        title: "Error",
        description: "Моля изберете роля",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await auth.login(email, password);
      } else {
        if (!selectedRole) {
          throw new Error('Моля изберете роля');
        }
        response = await auth.register(name, email, password, selectedRole);
      }
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        toast({
          title: "Success",
          description: isLogin ? "Успешен вход!" : "Успешна регистрация!",
        });
        onLogin(response.user.role as UserRole, response.user.name);
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || "Възникна грешка. Моля опитайте отново.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'Вход в системата' : 'Регистрация'}
          </CardTitle>
          <p className="text-pink-100">Влез в NailTime AI</p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection - Only show in registration mode */}
            {!isLogin && (
              <div>
                <Label className="text-sm font-medium mb-3 block">Избери роля</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedRole === role.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${role.color} rounded-lg flex items-center justify-center mb-2`}>
                        <role.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="font-medium text-sm">{role.title}</div>
                      <div className="text-xs text-gray-600">{role.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Име *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Въведи име"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Имейл *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Въведи имейл"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Парола *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Въведи парола"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300"
              >
                {isLoading ? 'Моля изчакайте...' : (isLogin ? 'Вход' : 'Регистрация')}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setSelectedRole(null);
                  setName('');
                  setEmail('');
                  setPassword('');
                }}
                className="w-full"
                disabled={isLoading}
              >
                {isLogin ? 'Нямаш акаунт? Регистрирай се' : 'Имаш акаунт? Влез'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;