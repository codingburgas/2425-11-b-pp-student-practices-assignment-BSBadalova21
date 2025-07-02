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
  Settings,
  X
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { auth } from '@/lib/auth';

interface OwnerDashboardProps {
  user: { role: string; name: string };
  onLogout: () => void;
}

interface StaffMember {
  id: number;
  name: string;
  email: string;
  status: string;
  appointments: number;
  rating: number;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
  });
  const [showCalendarModal, setShowCalendarModal] = useState(false);

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

  const monthlyData = [
    { day: '1', appointments: 45, revenue: 3600 },
    { day: '5', appointments: 52, revenue: 4200 },
    { day: '10', appointments: 48, revenue: 3800 },
    { day: '15', appointments: 55, revenue: 4400 },
    { day: '20', appointments: 60, revenue: 4800 },
    { day: '25', appointments: 58, revenue: 4600 },
    { day: '30', appointments: 50, revenue: 4000 },
  ];

  const yearlyData = [
    { month: 'Яну', appointments: 450, revenue: 36000 },
    { month: 'Фев', appointments: 480, revenue: 38400 },
    { month: 'Мар', appointments: 520, revenue: 41600 },
    { month: 'Апр', appointments: 490, revenue: 39200 },
    { month: 'Май', appointments: 550, revenue: 44000 },
    { month: 'Юни', appointments: 580, revenue: 46400 },
    { month: 'Юли', appointments: 600, revenue: 48000 },
    { month: 'Авг', appointments: 590, revenue: 47200 },
    { month: 'Сеп', appointments: 540, revenue: 43200 },
    { month: 'Окт', appointments: 510, revenue: 40800 },
    { month: 'Ное', appointments: 480, revenue: 38400 },
    { month: 'Дек', appointments: 520, revenue: 41600 },
  ];

  const serviceData = [
    { name: 'Гел лак', value: 35, color: '#FF6B9D' },
    { name: 'Френски', value: 25, color: '#9B59B6' },
    { name: 'Декорации', value: 20, color: '#3498DB' },
    { name: 'Класически', value: 15, color: '#E67E22' },
    { name: 'Други', value: 5, color: '#95A5A6' },
  ];

  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: 'Елена Петрова', email: 'elena@example.com', status: 'Активна', appointments: 8, rating: 4.9 },
    { id: 2, name: 'Мария Стоянова', email: 'maria@example.com', status: 'Активна', appointments: 6, rating: 4.8 },
    { id: 3, name: 'София Димитрова', email: 'sofia@example.com', status: 'Почивка', appointments: 0, rating: 4.7 },
  ]);

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

  const getChartData = () => {
    switch (selectedPeriod) {
      case 'week':
        return weeklyData;
      case 'month':
        return monthlyData;
      case 'year':
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const getXAxisDataKey = () => {
    switch (selectedPeriod) {
      case 'week':
        return 'day';
      case 'month':
        return 'day';
      case 'year':
        return 'month';
      default:
        return 'day';
    }
  };

  const exportData = () => {
    alert('📄 Данните се изтеглят като CSV файл...');
  };

  const handleAddEmployee = () => {
    if (newEmployee.name.trim() && newEmployee.email.trim()) {
      const newStaffMember: StaffMember = {
        id: staff.length + 1,
        name: newEmployee.name,
        email: newEmployee.email,
        status: 'Активна',
        appointments: 0,
        rating: 5.0
      };
      
      setStaff([...staff, newStaffMember]);
      setNewEmployee({ name: '', email: '' });
      setShowAddEmployeeModal(false);
    }
  };

  // Add fullSchedule and getStatusIcon
  const fullSchedule = [
    { date: '2025-06-20', slots: [
      { id: 1, time: '09:00', client: 'Елена Георгиева', service: 'Маникюр + Педикюр', status: 'completed', actualTime: 90 },
      { id: 2, time: '11:00', client: 'Ива Стоянова', service: 'Гел лак', status: 'completed', actualTime: 75 },
      { id: 3, time: '14:00', client: 'Мария Иванова', service: 'Гел лак с декорации', status: 'in-progress', actualTime: null },
    ]},
    { date: '2025-06-21', slots: [
      { id: 4, time: '10:00', client: 'Анна Петрова', service: 'Френски маникюр', status: 'scheduled', actualTime: null },
      { id: 5, time: '13:00', client: 'София Димитрова', service: 'Класически лак', status: 'scheduled', actualTime: null },
      { id: 6, time: '15:00', client: '', service: '', status: 'free', actualTime: null },
    ]},
    { date: '2025-05-22', slots: [
      { id: 7, time: '09:30', client: 'Мария Иванова', service: 'Гел лак с декорации', status: 'scheduled', actualTime: null },
      { id: 8, time: '11:30', client: '', service: '', status: 'free', actualTime: null },
      { id: 9, time: '14:30', client: 'Елена Георгиева', service: 'Маникюр + Педикюр', status: 'scheduled', actualTime: null },
    ]},
  ];

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
        {/* Stats Grid with Export Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className={`flex items-center gap-2 ${stat.color}`}>{React.createElement(stat.icon, { className: 'w-6 h-6' })} {stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.change}</div>
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
                  {selectedPeriod === 'week' && 'Седмична аналитика'}
                  {selectedPeriod === 'month' && 'Месечна аналитика'}
                  {selectedPeriod === 'year' && 'Годишна аналитика'}
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
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={getXAxisDataKey()} />
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
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                  onClick={() => setShowAddEmployeeModal(true)}
                >
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
                            <span>{member.email}</span>
                            <span>Записи днес: {member.appointments}</span>
                            <span>Рейтинг: ⭐ {member.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={member.status === 'Активна' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}>
                          {member.status}
                        </Badge>
                        <Button variant="destructive" size="sm" onClick={() => {
                          setStaff(staff.filter(s => s.id !== member.id));
                          toast({ title: 'Профилът е изтрит!' });
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Calendar Button */}
          <div className="space-y-6">
            {/* Profile Update */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <User className="w-5 h-5 text-blue-600" />
                  Профил
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} onUpdate={(updated) => { user.name = updated.name; toast({ title: 'Профилът е обновен!' }); }} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Салон Календар
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white" onClick={() => setShowCalendarModal(true)}>
                  Отвори календара
                </Button>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Добави нов служител</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddEmployeeModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Име</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="Въведете пълно име"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Имейл</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="Въведете имейл адрес"
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                onClick={handleAddEmployee}
              >
                Добави
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Salon Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Салон Календар</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCalendarModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Reuse fullSchedule rendering from WorkerDashboard or similar */}
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
            </CardContent>
          </Card>
        </div>
      )}
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
      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        {loading ? 'Обновяване...' : 'Обнови профила'}
      </Button>
    </form>
  );
};

export default OwnerDashboard;
