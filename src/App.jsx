import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TextInputSection from './components/TextInputSection';
import SentenceCard from './components/SentenceCard';
import EditModal from './components/EditModal';
import EmptyState from './components/EmptyState';
import { splitByPeriod, extractAndRemoveGenderPrefix } from './utils/textProcessing';
import { initSpeechSynthesis } from './utils/speechSynthesis';
import { showNotification } from './utils/notification';
import { defaultText } from './utils/constants';

function App() {
  const [inputText, setInputText] = useState(defaultText);
  const [sentences, setSentences] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const practiceContentRef = useRef(null);
  const textInputRef = useRef(null);

  const processText = useCallback(() => {
    try {
      const mixedText = inputText.trim();

      // 验证输入
      if (!mixedText) {
        showNotification('请输入文本内容', 'warning');
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
        return;
      }

      if (mixedText.length === 0) {
        showNotification('未检测到有效内容', 'warning');
        return;
      }

      // 处理日语句子
      const processedSentences = [];
      const sentenceTexts = splitByPeriod(mixedText);

      sentenceTexts.forEach(sentence => {
        if (sentence.trim() !== '') {
          const { text: processedText, gender } = extractAndRemoveGenderPrefix(sentence);
          processedSentences.push({
            text: processedText,
            gender: gender,
            chinese: '', // 空的中文翻译占位
            errors: [],
            lastErrorRange: { start: 0, end: 0 },
            lastErrorToParticleRange: { start: 0, end: 0 },
            shortPlayRange: { start: 0, end: 0 }
          });
        }
      });

      // 优化：无性别的句子继承前一个句子的性别
      for (let i = 0; i < processedSentences.length; i++) {
        if (!processedSentences[i].gender && i > 0) {
          // 向前查找最近的有性别的句子
          for (let j = i - 1; j >= 0; j--) {
            if (processedSentences[j].gender) {
              processedSentences[i].gender = processedSentences[j].gender;
              break;
            }
          }
        }
      }

      setSentences(processedSentences);
      showNotification(`已成功处理 ${processedSentences.length} 句日语`, 'success');

      // 滚动到练习内容的顶部，考虑导航栏高度
      setTimeout(() => {
        if (practiceContentRef.current) {
          const navbar = document.getElementById('navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const elementTop = practiceContentRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementTop - navbarHeight - 20,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (error) {
      console.error('处理文本时出错:', error);
      showNotification('处理文本时发生错误，请检查输入格式', 'error');
    }
  }, [inputText, practiceContentRef]);

  useEffect(() => {
    // 初始化语音合成
    initSpeechSynthesis();

    // 页面加载后自动处理文本
    setTimeout(() => {
      processText();
    }, 500);
  }, [processText]);

  const handleClear = () => {
    setInputText('');
    setSentences([]);
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (index, updatedSentence) => {
    const newSentences = [...sentences];
    newSentences[index] = {
      ...newSentences[index],
      ...updatedSentence
    };
    setSentences(newSentences);
    showNotification('句子已更新', 'success');
  };

  const handleFocusInput = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <div className="bg-gray-50 font-sans text-neutral-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 页面介绍 */}
        <section className="mb-10 text-center max-w-3xl mx-auto">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-neutral-800 mb-4 text-shadow">
            提升你的日语听力
          </h2>
          <p className="text-neutral-700 text-lg mb-6">
            听日语句子，尝试输入你听到的内容，检查答案后可针对性播放错误部分的语音，高效纠正问题。
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </section>

        {/* 文本输入区域 */}
        <div ref={textInputRef}>
          <TextInputSection
            text={inputText}
            setText={setInputText}
            onProcess={processText}
            onClear={handleClear}
          />
        </div>

        {/* 结果显示区域 */}
        {sentences.length > 0 ? (
          <section className="max-w-4xl mx-auto">
            <div ref={practiceContentRef} className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <i className="fa fa-list-alt text-primary mr-2"></i>练习内容
              </h3>
              <div className="text-sm text-neutral-600">
                <span>{sentences.length}</span> 组句子
              </div>
            </div>

            {/* 句子列表 */}
            <div className="space-y-8">
              {sentences.map((sentence, index) => (
                <SentenceCard
                  key={index}
                  sentence={sentence}
                  index={index}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState onFocus={handleFocusInput} />
        )}
      </main>

      <Footer />

      {/* 编辑模态框 */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        sentence={editingIndex !== null ? sentences[editingIndex] : null}
        index={editingIndex}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default App;
