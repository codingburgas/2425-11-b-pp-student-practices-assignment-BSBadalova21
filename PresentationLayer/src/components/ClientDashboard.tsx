import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar, Clock, Star, User, LogOut, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { auth } from '@/lib/auth';

interface ClientDashboardProps {
  user: { role: string; name: string };
  onLogout: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout }) => {
  const [nailLength, setNailLength] = useState('');
  const [colorCount, setColorCount] = useState(1);
  const [decorations, setDecorations] = useState(0);
  const [technique, setTechnique] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [complexity, setComplexity] = useState([3]);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  const availableTimes = ['12:30', '14:00', '15:30', '16:00', '17:30'];
  const pastAppointments = [
    { id: 1, date: '2025-06-20', service: 'Френски маникюр', time: '90 мин', rating: 5, status: 'завършен' },
    { id: 2, date: '2025-06-05', service: 'Гел лак', time: '75 мин', rating: 4, status: 'завършен' },
    { id: 3, date: '2025-05-22', service: 'Декорации', time: '120 мин', rating: 5, status: 'завършен' },
  ];

  const handlePredict = () => {
    // Simulate ML prediction
    const baseTime = 60;
    const lengthFactor = nailLength === 'short' ? 0.8 : nailLength === 'long' ? 1.3 : 1.0;
    const colorFactor = 1 + (colorCount - 1) * 0.15;
    const decorationFactor = 1 + decorations * 0.1;
    const complexityFactor = complexity[0] / 3;
    
    const predictedTime = Math.round(baseTime * lengthFactor * colorFactor * decorationFactor * complexityFactor);
    setPrediction(predictedTime);
  };

  const handleBooking = () => {
    if (selectedTime) {
      alert(`✅ Записани сте за ${selectedTime}! Очаквано време: ${prediction} минути`);
      setPrediction(null);
      setSelectedTime('');
    }
  };

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
                <p className="text-sm text-gray-600">Здравей, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 border-0">
                <User className="w-4 h-4 mr-1" />
                Клиент
              </Badge>
              <Button 
                variant="outline"
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Изход
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking Form */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Нова заявка за маникюр
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Дължина на ноктите</Label>
                    <Select value={nailLength} onValueChange={setNailLength}>
                      <SelectTrigger>
                        <SelectValue placeholder="Избери дължина" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Къси</SelectItem>
                        <SelectItem value="medium">Средни</SelectItem>
                        <SelectItem value="long">Дълги</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Техника</Label>
                    <Select value={technique} onValueChange={setTechnique}>
                      <SelectTrigger>
                        <SelectValue placeholder="Избери техника" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Класически лак</SelectItem>
                        <SelectItem value="gel">Гел лак</SelectItem>
                        <SelectItem value="french">Френски маникюр</SelectItem>
                        <SelectItem value="ombre">Омбре</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Брой цветове</Label>
                    <Input 
                      type="number" 
                      min="1" 
                      max="5" 
                      value={colorCount}
                      onChange={(e) => setColorCount(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Тип услуга</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Избери услуга" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manicure">Маникюр</SelectItem>
                        <SelectItem value="pedicure">Педикюр</SelectItem>
                        <SelectItem value="both">Маникюр + Педикюр</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Брой декорации</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="10" 
                    value={decorations}
                    onChange={(e) => setDecorations(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-4 block">
                    Сложност (1-5): {complexity[0]}
                  </Label>
                  <Slider
                    value={complexity}
                    onValueChange={setComplexity}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Button 
                  onClick={handlePredict}
                  disabled={!nailLength || !technique || !serviceType}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300"
                >
                  🤖 Прогнозирай време
                </Button>

                {prediction && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {prediction} минути
                      </div>
                      <div className="text-green-700">Очаквано време за услугата</div>
                    </div>

                    <div className="mb-4">
                      <Label className="text-sm font-medium mb-2 block">Свободни часове днес:</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={selectedTime === time ? "bg-purple-600 text-white" : ""}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleBooking}
                      disabled={!selectedTime}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      ✅ Потвърди резервацията
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Update */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <User className="w-5 h-5 text-pink-600" />
                  Профил
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} onUpdate={(updated) => { user.name = updated.name; toast({ title: 'Профилът е обновен!' }); }} />
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Предстоящи записи
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Няма предстоящи записи</p>
                </div>
              </CardContent>
            </Card>

            {/* Past Appointments */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5 text-purple-600" />
                  История
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{appointment.service}</div>
                        <div className="text-sm text-gray-600">{appointment.date}</div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Време: {appointment.time}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < appointment.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileForm: React.FC<{ user: { name: string; email?: string }; onUpdate: (u: { name: string; email: string }) => void }> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData: any = {};
      if (name !== user.name) updateData.name = name;
      if (email && email !== user.email) updateData.email = email;
      if (newPassword) updateData.password = newPassword;
      if ((updateData.email || updateData.password) && !currentPassword) {
        toast({ title: 'Моля въведете текущата парола за промяна на имейл или парола', variant: 'destructive' });
        setLoading(false);
        return;
      }
      if (updateData.email || updateData.password) updateData.current_password = currentPassword;
      if (Object.keys(updateData).length === 0) {
        toast({ title: 'Няма промени за обновяване', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const res = await auth.updateUser(updateData);
      onUpdate(res.user);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast({ title: 'Грешка', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Име</Label>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <Label>Имейл</Label>
        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
      </div>
      <div>
        <Label>Нова парола</Label>
        <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="Оставете празно за без промяна" />
      </div>
      {(email !== user.email || newPassword) && (
        <div>
          <Label>Текуща парола</Label>
          <Input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} type="password" required />
        </div>
      )}
      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        {loading ? 'Обновяване...' : 'Обнови профила'}
      </Button>
    </form>
  );
};

export default ClientDashboard;
