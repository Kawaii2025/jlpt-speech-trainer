import { useState, useEffect } from 'react';

function EditModal({ isOpen, onClose, sentence, index, onSave }) {
  const [gender, setGender] = useState('');
  const [japanese, setJapanese] = useState('');
  const [chinese, setChinese] = useState('');

  useEffect(() => {
    if (isOpen && sentence) {
      setGender(sentence.gender || '');
      setJapanese(sentence.text || '');
      setChinese(sentence.chinese || '');
    }
  }, [isOpen, sentence]);

  const handleSave = () => {
    onSave(index, {
      gender: gender,
      text: japanese.trim(),
      chinese: chinese.trim()
    });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-800">编辑句子</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-800"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="edit-gender" className="block text-sm font-medium text-neutral-700 mb-1">
              性别
            </label>
            <select
              id="edit-gender"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">无</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="edit-japanese" className="block text-sm font-medium text-neutral-700 mb-1">
              日语句子
            </label>
            <textarea
              id="edit-japanese"
              rows="3"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary font-japanese"
              value={japanese}
              onChange={(e) => setJapanese(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="edit-chinese" className="block text-sm font-medium text-neutral-700 mb-1">
              中文翻译
            </label>
            <textarea
              id="edit-chinese"
              rows="3"
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              value={chinese}
              onChange={(e) => setChinese(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-4 bg-neutral-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
