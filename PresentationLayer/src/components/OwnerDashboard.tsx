
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  User, 
  LogOut, 
  Download, 
  Plus,
  Settings
} from 'lucide-react';

interface OwnerDashboardProps {
  user: { role: string; name: string };
  onLogout: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Demo data
  const stats = [
    { title: 'Дневни записи', value: '23', change: '+12%', icon: Calendar, color: 'text-blue-600' },
    { title: 'Активни клиенти', value: '156', change: '+8%', icon: Users, color: 'text-green-600' },
    { title: 'Средно време', value: '85 мин', change: '-5%', icon: Clock, color: 'text-purple-600' },
    { title: 'Приходи днес', value: '2,450 лв', change: '+15%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const weeklyData = [
    { day: 'Пон', appointments: 15, revenue: 1200 },
    { day: 'Вто', appointments: 18, revenue: 1450 },
    { day: 'Сря', appointments: 22, revenue: 1750 },
    { day: 'Чет', appointments: 20, revenue: 1600 },
    { day: 'Пет', appointments: 25, revenue: 2000 },
    { day: 'Съб', appointments: 30, revenue: 2400 },
    { day: 'Нед', appointments: 12, revenue: 950 },
  ];

  const serviceData = [
    { name: 'Гел лак', value: 35, color: '#FF6B9D' },
    { name: 'Френски', value: 25, color: '#9B59B6' },
    { name: 'Декорации', value: 20, color: '#3498DB' },
    { name: 'Класически', value: 15, color: '#E67E22' },
    { name: 'Други', value: 5, color: '#95A5A6' },
  ];

  const staff = [
    { id: 1, name: 'Елена Петрова', status: 'Активна', appointments: 8, rating: 4.9 },
    { id: 2, name: 'Мария Стоянова', status: 'Активна', appointments: 6, rating: 4.8 },
    { id: 3, name: 'София Димитрова', status: 'Почивка', appointments: 0, rating: 4.7 },
  ];

  const recentBookings = [
    { id: 1, client: 'Анна Иванова', service: 'Гел лак', time: '14:30', worker: 'Елена Петрова', status: 'confirmed' },
    { id: 2, client: 'Мария Петкова', service: 'Френски маникюр', time: '15:00', worker: 'Мария Стоянова', status: 'pending' },
    { id: 3, client: 'София Георгиева', service: 'Декорации', time: '15:30', worker: 'Елена Петрова', status: 'confirmed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportData = () => {
    alert('📄 Данните се изтеглят като CSV файл...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">💅</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  NailTime AI
                </h1>
                <p className="text-sm text-gray-600">Здравей, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-0">
                <User className="w-4 h-4 mr-1" />
                Собственик
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics Chart */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Седмична аналитика
                </CardTitle>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Седмица</SelectItem>
                    <SelectItem value="month">Месец</SelectItem>
                    <SelectItem value="year">Година</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#3B82F6" name="Записи" />
                      <Bar dataKey="revenue" fill="#06B6D4" name="Приходи (лв)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Staff Management */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Users className="w-6 h-6 text-blue-600" />
                  Управление на персонал
                </CardTitle>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Добави служител
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staff.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Записи днес: {member.appointments}</span>
                            <span>Рейтинг: ⭐ {member.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={member.status === 'Активна' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}>
                          {member.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Distribution */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Разпределение на услуги
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {serviceData.map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: service.color }}
                        />
                        <span>{service.name}</span>
                      </div>
                      <span className="font-medium">{service.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Последни записи
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">{booking.client}</div>
                        <div className="text-xs text-gray-600">{booking.service}</div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.time}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      Маникюрист: {booking.worker}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Download className="w-5 h-5 text-blue-600" />
                  Експорт на данни
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={exportData}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Изтегли CSV
                </Button>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Calendar className="w-4 h-4 mr-2" />
                  Календар на салона
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
