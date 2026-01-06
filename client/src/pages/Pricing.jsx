import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { getPackages, updatePackage } from '../services/api';

const Pricing = () => {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const { data } = await getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Load packages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage({ ...pkg });
  };

  const handleSave = async () => {
    try {
      await updatePackage(editingPackage.id, editingPackage);
      setEditingPackage(null);
      loadPackages();
      alert('패키지가 수정되었습니다!');
    } catch (error) {
      alert('수정 실패: ' + error.message);
    }
  };

  const addFeature = () => {
    setEditingPackage({
      ...editingPackage,
      features: [...editingPackage.features, '']
    });
  };

  const removeFeature = (index) => {
    const newFeatures = editingPackage.features.filter((_, i) => i !== index);
    setEditingPackage({ ...editingPackage, features: newFeatures });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...editingPackage.features];
    newFeatures[index] = value;
    setEditingPackage({ ...editingPackage, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold mb-2">가격편성관리</h1>
        <p className="text-gray-400">패키지별 가격 및 기능을 관리하세요</p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`bg-dark-card border rounded-xl p-8 relative hover:border-blue-500/50 transition-all ${
              pkg.badge ? 'border-blue-500' : 'border-dark-border'
            }`}
          >
            {pkg.badge && (
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                {pkg.badge}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-white text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="text-white text-4xl font-bold mb-4">
                ₩{pkg.price.toLocaleString()}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 pt-4 border-t border-dark-border">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">작업 일수</span>
                <span className="text-white font-medium">{pkg.workDays}일</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">수정 횟수</span>
                <span className="text-white font-medium">{pkg.revisions}회</span>
              </div>
            </div>

            <button
              onClick={() => handleEdit(pkg)}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Edit2 size={18} />
              편집
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPackage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-white text-2xl font-bold mb-6">패키지 편집 - {editingPackage.name}</h3>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">패키지명</label>
                  <input
                    type="text"
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">가격 (원)</label>
                  <input
                    type="number"
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({...editingPackage, price: parseInt(e.target.value)})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">작업 일수</label>
                  <input
                    type="number"
                    value={editingPackage.workDays}
                    onChange={(e) => setEditingPackage({...editingPackage, workDays: parseInt(e.target.value)})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">수정 횟수</label>
                  <input
                    type="number"
                    value={editingPackage.revisions}
                    onChange={(e) => setEditingPackage({...editingPackage, revisions: parseInt(e.target.value)})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">배지 (선택사항)</label>
                <input
                  type="text"
                  value={editingPackage.badge || ''}
                  onChange={(e) => setEditingPackage({...editingPackage, badge: e.target.value})}
                  placeholder="예: 추천, 인기"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-gray-400 text-sm">기능 목록</label>
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <Plus size={16} />
                    기능 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {editingPackage.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="기능을 입력하세요"
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-dark-border">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  저장
                </button>
                <button
                  onClick={() => setEditingPackage(null)}
                  className="flex-1 bg-dark-bg text-white py-3 rounded-lg hover:bg-gray-700"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
