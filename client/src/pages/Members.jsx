import React, { useEffect, useState } from 'react';
import { Search, Mail, MessageSquare, Edit } from 'lucide-react';
import { getMembers, updateMember, sendKakaoMessage } from '../services/api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, [search, selectedGrade]);

  const loadMembers = async () => {
    try {
      const { data } = await getMembers({ search, grade: selectedGrade });
      setMembers(data.members || []);
    } catch (error) {
      console.error('Load members error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
  };

  const handleSave = async () => {
    try {
      await updateMember(editingMember.id, editingMember);
      setEditingMember(null);
      loadMembers();
      alert('회원 정보가 수정되었습니다.');
    } catch (error) {
      alert('수정 실패: ' + error.message);
    }
  };

  const handleSendKakao = async (member) => {
    const message = prompt(`${member.name}님에게 보낼 메시지를 입력하세요:`);
    if (!message) return;

    try {
      await sendKakaoMessage({ memberIds: [member.id], message });
      alert('카카오 메시지가 발송되었습니다.');
    } catch (error) {
      alert('발송 실패: ' + error.message);
    }
  };

  const gradeColors = {
    BASIC: 'bg-gray-500',
    VIP: 'bg-blue-500',
    PREMIUM: 'bg-purple-500'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">회원관리</h1>
          <p className="text-gray-400">총 {members.length}명의 회원</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 이메일 검색..."
              className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white"
            />
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white"
          >
            <option value="">전체 등급</option>
            <option value="BASIC">BASIC</option>
            <option value="VIP">VIP</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">이름</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">이메일</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">전화번호</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">등급</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">가입일</th>
                <th className="px-6 py-4 text-left text-gray-400 font-medium">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-dark-bg/50">
                  <td className="px-6 py-4 text-white">{member.name}</td>
                  <td className="px-6 py-4 text-gray-400">{member.email}</td>
                  <td className="px-6 py-4 text-gray-400">{member.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${gradeColors[member.grade]}`}>
                      {member.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                        title="수정"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleSendKakao(member)}
                        className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg"
                        title="카카오 메시지"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-4">회원 정보 수정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">이름</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">등급</label>
                <select
                  value={editingMember.grade}
                  onChange={(e) => setEditingMember({...editingMember, grade: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white"
                >
                  <option value="BASIC">BASIC</option>
                  <option value="VIP">VIP</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">메모</label>
                <textarea
                  value={editingMember.memo || ''}
                  onChange={(e) => setEditingMember({...editingMember, memo: e.target.value})}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white h-24"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingMember(null)}
                  className="flex-1 bg-dark-bg text-white py-2 rounded-lg hover:bg-gray-700"
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

export default Members;
