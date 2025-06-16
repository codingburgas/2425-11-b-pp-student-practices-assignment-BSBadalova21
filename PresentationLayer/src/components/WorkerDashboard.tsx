import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, LogOut, CheckCircle, XCircle, Camera } from 'lucide-react';

interface WorkerDashboardProps {
  user: { role: string; name: string };
  onLogout: () => void;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ user, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, client: 'Мария Иванова', service: 'Гел лак с декорации', estimatedTime: 85, time: '14:00' },
    { id: 2, client: 'Анна Петрова', service: 'Френски маникюр', estimatedTime: 75, time: '15:30' },
    { id: 3, client: 'София Димитрова', service: 'Класически лак', estimatedTime: 60, time: '16:00' },
  ]);

  const fullSchedule = [
    { date: '2024-03-20', slots: [
      { id: 1, time: '09:00', client: 'Елена Георгиева', service: 'Маникюр + Педикюр', status: 'completed', actualTime: 90 },
      { id: 2, time: '11:00', client: 'Ива Стоянова', service: 'Гел лак', status: 'completed', actualTime: 75 },
      { id: 3, time: '14:00', client: 'Мария Иванова', service: 'Гел лак с декорации', status: 'in-progress', actualTime: null },
    ]},
    { date: '2024-03-21', slots: [
      { id: 4, time: '10:00', client: 'Анна Петрова', service: 'Френски маникюр', status: 'scheduled', actualTime: null },
      { id: 5, time: '13:00', client: 'София Димитрова', service: 'Класически лак', status: 'scheduled', actualTime: null },
      { id: 6, time: '15:00', client: '', service: '', status: 'free', actualTime: null },
    ]},
    { date: '2024-03-22', slots: [
      { id: 7, time: '09:30', client: 'Мария Иванова', service: 'Гел лак с декорации', status: 'scheduled', actualTime: null },
      { id: 8, time: '11:30', client: '', service: '', status: 'free', actualTime: null },
      { id: 9, time: '14:30', client: 'Елена Георгиева', service: 'Маникюр + Педикюр', status: 'scheduled', actualTime: null },
    ]},
  ];

  const todaySchedule = [
    { id: 1, time: '09:00', client: 'Елена Георгиева', service: 'Маникюр + Педикюр', status: 'completed', actualTime: 90 },
    { id: 2, time: '11:00', client: 'Ива Стоянова', service: 'Гел лак', status: 'completed', actualTime: 75 },
    { id: 3, time: '12:30', client: 'Мария Иванова', service: 'Гел лак с декорации', status: 'in-progress', actualTime: null },
    { id: 4, time: '14:00', client: '', service: '', status: 'free', actualTime: null },
    { id: 5, time: '15:30', client: '', service: '', status: 'free', actualTime: null },
    { id: 6, time: '16:00', client: '', service: '', status: 'free', actualTime: null },
  ];

  const handleAccept = (requestId: number) => {
    setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    alert(`✅ Заявката е приета!`);
  };

  const handleReject = (requestId: number) => {
    setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    alert(`❌ Заявката е отказана!`);
  };

  const handleComplete = (appointmentId: number, actualTime: number) => {
    alert(`✅ Услугата е завършена! Време: ${actualTime} минути`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'free': return '🟢';
      case 'in-progress': return '🟡';
      case 'completed': return '🔵';
      case 'scheduled': return '🟣';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">💅</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  NailTime AI
                </h1>
                <p className="text-sm text-gray-600">Здравей, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-0">
                <User className="w-4 h-4 mr-1" />
                Маникюрист
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
            {/* Pending Requests */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Нови заявки ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.client}</h3>
                            <p className="text-sm text-gray-600">{request.service}</p>
                          </div>
                          <Badge variant="outline" className="text-purple-600 border-purple-200">
                            {request.time}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Прогнозно време: <span className="font-medium">{request.estimatedTime} мин</span>
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Откажи
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAccept(request.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Приеми
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Няма нови заявки</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  {showFullSchedule ? 'Цял график' : `График за ${new Date().toLocaleDateString('bg-BG')}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {showFullSchedule ? (
                  <div className="space-y-6">
                    {fullSchedule.map((day) => (
                      <div key={day.date} className="space-y-3">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {new Date(day.date).toLocaleDateString('bg-BG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        {day.slots.map((slot) => (
                          <div key={slot.id} className={`p-4 rounded-lg border-2 ${getStatusColor(slot.status)}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getStatusIcon(slot.status)}</span>
                                <div>
                                  <div className="font-semibold">{slot.time}</div>
                                  {slot.client && (
                                    <div className="text-sm">
                                      <div>{slot.client}</div>
                                      <div className="text-gray-600">{slot.service}</div>
                                    </div>
                                  )}
                                  {!slot.client && (
                                    <div className="text-sm text-gray-600">Свободен час</div>
                                  )}
                                </div>
                              </div>
                              
                              {slot.status === 'in-progress' && (
                                <div className="flex items-center gap-2">
                                  <Input 
                                    type="number" 
                                    placeholder="Време (мин)" 
                                    className="w-24 h-8 text-sm"
                                  />
                                  <Button 
                                    size="sm"
                                    onClick={() => handleComplete(slot.id, 85)}
                                    className="bg-green-600 hover:bg-green-700 text-white h-8"
                                  >
                                    Завърши
                                  </Button>
                                </div>
                              )}
                              
                              {slot.status === 'completed' && slot.actualTime && (
                                <div className="text-sm text-gray-600">
                                  Завършено за {slot.actualTime} мин
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaySchedule.map((slot) => (
                      <div key={slot.id} className={`p-4 rounded-lg border-2 ${getStatusColor(slot.status)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getStatusIcon(slot.status)}</span>
                            <div>
                              <div className="font-semibold">{slot.time}</div>
                              {slot.client && (
                                <div className="text-sm">
                                  <div>{slot.client}</div>
                                  <div className="text-gray-600">{slot.service}</div>
                                </div>
                              )}
                              {!slot.client && (
                                <div className="text-sm text-gray-600">Свободен час</div>
                              )}
                            </div>
                          </div>
                          
                          {slot.status === 'in-progress' && (
                            <div className="flex items-center gap-2">
                              <Input 
                                type="number" 
                                placeholder="Време (мин)" 
                                className="w-24 h-8 text-sm"
                              />
                              <Button 
                                size="sm"
                                onClick={() => handleComplete(slot.id, 85)}
                                className="bg-green-600 hover:bg-green-700 text-white h-8"
                              >
                                Завърши
                              </Button>
                            </div>
                          )}
                          
                          {slot.status === 'completed' && slot.actualTime && (
                            <div className="text-sm text-gray-600">
                              Завършено за {slot.actualTime} мин
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  Бързи действия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {showFullSchedule ? 'Виж днешния график' : 'Виж целия график'}
                </Button>
              </CardContent>
            </Card>

            {/* Today's Stats */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Статистики за днес
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-green-700">Завършени услуги</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-yellow-700">В процес</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">82.5</div>
                  <div className="text-sm text-blue-700">Средно време (мин)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
