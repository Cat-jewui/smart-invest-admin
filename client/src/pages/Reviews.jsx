import React, { useEffect, useState } from 'react';
import { Star, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { getReviews, replyToReview } from '../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data } = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Load reviews error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      alert('답변을 입력해주세요.');
      return;
    }

    try {
      await replyToReview(reviewId, replyText);
      setReplyingTo(null);
      setReplyText('');
      loadReviews();
      alert('답변이 등록되었습니다!');
    } catch (error) {
      alert('답변 등록 실패: ' + error.message);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
          />
        ))}
      </div>
    );
  };

  const sourceColors = {
    KMONG: 'bg-purple-500/20 text-purple-400',
    WEBSITE: 'bg-blue-500/20 text-blue-400'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">리뷰관리</h1>
          <p className="text-gray-400">총 {reviews.length}개의 리뷰</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-400">크몽 리뷰</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">자체 리뷰</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div 
            key={review.id}
            className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {review.Member?.name?.[0] || '?'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold">
                      {review.Member?.name || '익명'}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceColors[review.source]}`}>
                      {review.source === 'KMONG' ? '크몽' : '자체'}
                    </span>
                    {!review.isVisible && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium flex items-center gap-1">
                        <EyeOff size={12} />
                        비공개
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {renderStars(review.rating)}
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <p className="text-gray-300 leading-relaxed">{review.content}</p>
            </div>

            {/* Admin Reply */}
            {review.adminReply ? (
              <div className="bg-dark-bg border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={16} className="text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm">관리자 답변</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(review.repliedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300">{review.adminReply}</p>
              </div>
            ) : review.source === 'WEBSITE' ? (
              <div>
                {replyingTo === review.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="답변을 입력하세요..."
                      className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white resize-none"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(review.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        답변 등록
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-700"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(review.id)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <MessageCircle size={16} />
                    답변 작성
                  </button>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic">
                크몽 리뷰는 답변을 작성할 수 없습니다.
              </div>
            )}
          </div>
        ))}
      </div>

      {reviews.length === 0 && !loading && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <Star className="mx-auto mb-4 text-gray-600" size={48} />
          <p className="text-gray-400">아직 리뷰가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
