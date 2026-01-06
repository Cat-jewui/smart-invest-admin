import React, { useEffect, useState } from 'react';
import { Calendar, Upload, TrendingUp, DollarSign } from 'lucide-react';
import { getRevenue, uploadKmongRevenue } from '../services/api';

const Revenue = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenue();
  }, [startDate, endDate, selectedSource]);

  const loadRevenue = async () => {
    try {
      const { data } = await getRevenue({ 
        startDate, 
        endDate, 
        source: selectedSource 
      });
      setPayments(data.payments || []);
      setSummary(data.summary || {});
    } catch (error) {
      console.error('Load revenue error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = () => {
    const csvData = prompt('CSV 데이터를 붙여넣으세요 (형식: 날짜,패키지명,금액):');
    if (!csvData) return;

    // 간단한 CSV 파싱 (실제로는 파일 업로드 사용)
    const rows = csvData.split('\n').map(row => {
      const [date, packageName, amount] = row.split(',');
      return { paidAt: date, packageName, amount: parseInt(amount) };
    });

    uploadKmongRevenue({ data: rows })
      .then(() => {
        alert('크몽 수익이 업로드되었습니다!');
        loadRevenue();
      })
      .catch(error => alert('업로드 실패: ' + error.message));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">수익정산관리</h1>
          <p className="text-gray-400">크몽 및 자체결제 수익 현황</p>
        </div>
        <button
          onClick={handleCSVUpload}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Upload size={20} />
          크몽 CSV 업로드
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">총 수익</p>
              <h3 className="text-white text-2xl font-bold">
                ₩{(summary.total || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">자체결제</p>
              <h3 className="text-white text-2xl font-bold">
                ₩{(summary.tossTotal || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">크몽 수익</p>
              <h3 className="text-white text-2xl font-bold">
                ₩{(summary.kmongTotal || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">시작일</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">종료일</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">결제 출처</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white"
            >
              <option value="">전체</option>
              <option value="TOSS">자체결제 (토스)</option>
              <option value="KMONG">크몽</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadRevenue}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              조회
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">결제일</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">회원</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">패키지</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">금액</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">출처</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-dark-bg/50">
                  <td className="px-6 py-4 text-white">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {payment.Member?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-white">{payment.packageName}</td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ₩{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.source === 'TOSS' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {payment.source === 'TOSS' ? '자체결제' : '크몽'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'COMPLETED' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {payment.status === 'COMPLETED' ? '완료' : payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">결제 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Revenue;
