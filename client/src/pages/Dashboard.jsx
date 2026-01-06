import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Star, MessageCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import KPICard from '../components/KPICard';
import { 
  getDashboardStats, 
  getDailySignups, 
  getDailyRevenue,
  getPackageSales,
  getRevenueSource
} from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [dailySignups, setDailySignups] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [packageSales, setPackageSales] = useState([]);
  const [revenueSource, setRevenueSource] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, signupsRes, revenueRes, salesRes, sourceRes] = await Promise.all([
        getDashboardStats(),
        getDailySignups(),
        getDailyRevenue(),
        getPackageSales(),
        getRevenueSource()
      ]);

      setStats(statsRes.data);
      setDailySignups(signupsRes.data);
      setDailyRevenue(revenueRes.data);
      setPackageSales(salesRes.data);
      setRevenueSource(sourceRes.data);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-400">전체 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="오늘 방문자"
          value={stats?.todayVisitors || 0}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="현재 회원수"
          value={stats?.totalMembers || 0}
          icon={Users}
          color="green"
        />
        <KPICard
          title="이번달 수익"
          value={`₩${(stats?.monthlyRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="purple"
        />
        <KPICard
          title="평균 평점"
          value={stats?.avgRating || '0.0'}
          icon={Star}
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Signups */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">일별 회원가입 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySignups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} name="가입자 수" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Package Sales */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">패키지별 판매 현황</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={packageSales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.packageName}: ${entry.count}건`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {packageSales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">일별 결제 수익</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="total" fill="#8B5CF6" name="수익 (원)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Source */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-white text-lg font-semibold mb-4">크몽 vs 자체결제</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueSource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.source}: ₩${(entry.total || 0).toLocaleString()}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="total"
              >
                {revenueSource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#10B981'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4">실시간 활동</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-dark-bg rounded-lg">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Users className="text-blue-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">새 회원 가입</p>
              <p className="text-gray-400 text-sm">홍길동님이 가입했습니다</p>
            </div>
            <span className="text-gray-500 text-sm">5분 전</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-bg rounded-lg">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="text-green-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">결제 완료</p>
              <p className="text-gray-400 text-sm">DELUXE 패키지 - ₩50,000</p>
            </div>
            <span className="text-gray-500 text-sm">15분 전</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-bg rounded-lg">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <MessageCircle className="text-purple-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">새 문의</p>
              <p className="text-gray-400 text-sm">고객 문의가 도착했습니다</p>
            </div>
            <span className="text-gray-500 text-sm">30분 전</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
