import React, { useEffect, useState } from 'react';
import { Plus, Calendar, TrendingDown, DollarSign, Trash2 } from 'lucide-react';
import { getCosts, createCost } from '../services/api';
import Modal from '../components/Modal';

const Costs = () => {
  const [costs, setCosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'info' });
  const [newCost, setNewCost] = useState({
    category: 'PAYMENT_FEE',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false
  });

  useEffect(() => {
    loadCosts();
  }, [startDate, endDate]);

  const loadCosts = async () => {
    try {
      const { data } = await getCosts({ startDate, endDate });
      setCosts(data.costs || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Load costs error:', error);
    }
  };

  const handleAddCost = async () => {
    try {
      await createCost({
        ...newCost,
        amount: parseInt(newCost.amount)
      });
      setShowAddModal(false);
      setNewCost({
        category: 'PAYMENT_FEE',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false
      });
      loadCosts();
      setModal({ show: true, title: '등록 완료', message: '비용이 등록되었습니다!', type: 'success' });
    } catch (error) {
      setModal({ show: true, title: '등록 실패', message: '등록 실패: ' + (error.message || '오류'), type: 'error' });
    }
  };

  const categoryLabels = {
    PAYMENT_FEE: '결제 수수료',
    KMONG_FEE: '크몽 수수료',
    SERVER: '서버 비용',
    DOMAIN: '도메인',
    MARKETING: '마케팅',
    ETC: '기타'
  };

  const categoryColors = {
    PAYMENT_FEE: 'bg-blue-500/20 text-blue-400',
    KMONG_FEE: 'bg-purple-500/20 text-purple-400',
    SERVER: 'bg-green-500/20 text-green-400',
    DOMAIN: 'bg-yellow-500/20 text-yellow-400',
    MARKETING: 'bg-pink-500/20 text-pink-400',
    ETC: 'bg-gray-500/20 text-gray-400'
  };

  // 카테고리별 합계 계산
  const categoryTotals = costs.reduce((acc, cost) => {
    acc[cost.category] = (acc[cost.category] || 0) + cost.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">비용관리</h1>
          <p className="text-gray-400">서비스 운영 비용을 관리하세요</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          비용 추가
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">총 비용</p>
              <h3 className="text-white text-2xl font-bold">
                ₩{total.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">결제 수수료</p>
              <h3 className="text-white text-2xl font-bold">
                ₩{(categoryTotals.PAYMENT_FEE || 0).toLocaleString()}
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
              <p className="text-gray-400 text-sm">크몽 수수료</p>
              <h3 className="text-white text-2xl font-bold">
                ₩{(categoryTotals.KMONG_FEE || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">서버 비용</p>
              <h3 className="text-white text-2xl font-bold">
                ₩{(categoryTotals.SERVER || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex items-end">
            <button
              onClick={loadCosts}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              조회
            </button>
          </div>
        </div>
      </div>

      {/* Costs Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">날짜</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">카테고리</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">내역</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">금액</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">정기결제</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {costs.map((cost) => (
                <tr key={cost.id} className="hover:bg-dark-bg/50">
                  <td className="px-6 py-4 text-white">
                    {new Date(cost.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[cost.category]}`}>
                      {categoryLabels[cost.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{cost.description || '-'}</td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ₩{cost.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {cost.isRecurring ? (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                        정기
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                        일회성
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {costs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">등록된 비용이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Add Cost Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">비용 추가</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">카테고리</label>
                <select
                  value={newCost.category}
                  onChange={(e) => setNewCost({...newCost, category: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">금액 (원)</label>
                <input
                  type="number"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({...newCost, amount: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">날짜</label>
                <input
                  type="date"
                  value={newCost.date}
                  onChange={(e) => setNewCost({...newCost, date: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">내역</label>
                <textarea
                  value={newCost.description}
                  onChange={(e) => setNewCost({...newCost, description: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white h-20"
                  placeholder="상세 내역을 입력하세요"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={newCost.isRecurring}
                  onChange={(e) => setNewCost({...newCost, isRecurring: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="isRecurring" className="text-gray-400 text-sm">
                  정기 결제
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddCost}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-dark-bg text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
};

export default Costs;
