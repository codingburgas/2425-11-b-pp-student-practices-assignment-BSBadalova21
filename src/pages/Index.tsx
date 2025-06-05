
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuthModal from '@/components/AuthModal';
import ClientDashboard from '@/components/ClientDashboard';
import WorkerDashboard from '@/components/WorkerDashboard';
import OwnerDashboard from '@/components/OwnerDashboard';
import { User, Calendar, TrendingUp } from 'lucide-react';

export type UserRole = 'client' | 'worker' | 'owner' | null;

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{role: UserRole, name: string} | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleLogin = (role: UserRole, name: string) => {
    setCurrentUser({ role, name });
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Demo data for statistics
  const stats = [
   
    
    
  ];

  if (currentUser) {
    switch (currentUser.role) {
      case 'client':
        return <ClientDashboard user={currentUser} onLogout={handleLogout} />;
      case 'worker':
        return <WorkerDashboard user={currentUser} onLogout={handleLogout} />;
      case 'owner':
        return <OwnerDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">💅</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  NailTime AI
                </h1>
                <p className="text-sm text-gray-600">Интелигентна система за маникюр</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowAuth(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Вход / Регистрация
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Бъдещето на<br />маникюрните услуги
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Интелигентна система, която използва машинно обучение за точно прогнозиране на времето за маникюр 
              и оптимизира работния процес на салона.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={() => setShowAuth(true)}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Започни сега
              </Button>
              
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Три роли, една система
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Платформата е създадена да обслужва всички участници в процеса - от клиенти до собственици на салони.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Client Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-pink-800">Клиенти</CardTitle>
                <CardDescription>Лесно резервиране с AI прогнози</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>AI прогнозиране на времето</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Онлайн резервации</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>История на услугите</span>
                </div>
              </CardContent>
            </Card>

            {/* Worker Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-purple-800">Работници</CardTitle>
                <CardDescription>Управление на график и заявки</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Дневен календар</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Управление на заявки</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Отчитане на времето</span>
                </div>
              </CardContent>
            </Card>

            {/* Owner Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-800">Собственици</CardTitle>
                <CardDescription>Аналитика и управление</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Dashboard с аналитика</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Управление на персонал</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Експорт на данни</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
           
           
          </div>
          
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default Index;
