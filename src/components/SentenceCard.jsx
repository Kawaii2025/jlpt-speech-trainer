import { useState } from 'react';
import { speakJapanese } from '../utils/speechSynthesis';
import { compareTexts, findNextParticlePosition, findNthParticlePosition } from '../utils/textProcessing';
import { japaneseParticles } from '../utils/constants';
import { showNotification } from '../utils/notification';

function SentenceCard({ sentence, index, onEdit }) {
  const [userInput, setUserInput] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [errorRanges, setErrorRanges] = useState({
    errorRange: null,
    errorToParticleRange: null,
    shortPlayRange: null
  });

  const handlePlay = () => {
    speakJapanese(sentence.text, sentence.gender);
  };

  const handleCheck = () => {
    const trimmedInput = userInput.trim();
    
    if (!trimmedInput) {
      showNotification('请先输入内容', 'warning');
      return;
    }

    const result = compareTexts(trimmedInput, sentence.text);
    setCheckResult(result);

    // 计算错误范围
    if (result.errorPositions.length > 0) {
      const startPos = Math.min(...result.errorPositions);
      const endPos = Math.max(...result.errorPositions);
      
      const particleEndPos = findNextParticlePosition(sentence.text, startPos, japaneseParticles);
      const shortPlayEndPos = findNthParticlePosition(sentence.text, startPos, 3, japaneseParticles);
      
      setErrorRanges({
        errorRange: { start: startPos, end: endPos },
        errorToParticleRange: { start: startPos, end: particleEndPos },
        shortPlayRange: { start: startPos, end: shortPlayEndPos }
      });
    }
  };

  const handlePlayError = (rangeType) => {
    const trimmedInput = userInput.trim();
    
    if (!trimmedInput) {
      showNotification('请先输入内容再播放', 'warning');
      return;
    }

    // 如果没有检查结果，先检查
    if (!checkResult) {
      handleCheck();
      return;
    }

    if (checkResult.correct) {
      return;
    }

    const range = errorRanges[rangeType];
    if (range) {
      const playText = sentence.text.substring(
        range.start,
        Math.min(range.end + 1, sentence.text.length)
      );
      speakJapanese(playText, sentence.gender);
    }
  };

  const handleToggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  const handleEdit = () => {
    onEdit(index);
  };

  const genderBadge = sentence.gender === 'male' 
    ? <span className="bg-male/10 text-male text-xs font-medium px-2 py-0.5 rounded ml-2">男性</span>
    : sentence.gender === 'female'
    ? <span className="bg-female/10 text-female text-xs font-medium px-2 py-0.5 rounded ml-2">女性</span>
    : null;

  const showErrorButtons = userInput.trim() !== '' && checkResult && !checkResult.correct;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 card-hover border border-neutral-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            句子 {index + 1}
          </span>
          {genderBadge}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePlay}
            className="text-neutral-500 hover:text-secondary transition-colors p-2 rounded-full hover:bg-secondary/10 focus:outline-none"
          >
            <i className="fa fa-volume-up text-xl"></i>
          </button>
          <button
            onClick={handleToggleOriginal}
            className="text-neutral-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10 focus:outline-none"
          >
            <i className={`fa ${showOriginal ? 'fa-eye-slash' : 'fa-eye'} text-xl`}></i>
          </button>
          <button
            onClick={handleEdit}
            className="text-neutral-500 hover:text-accent transition-colors p-2 rounded-full hover:bg-accent/10 focus:outline-none"
          >
            <i className="fa fa-pencil text-xl"></i>
          </button>
        </div>
      </div>

      {/* 用户输入区域 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-500 mb-2">请输入你听到的日语</h4>
        <textarea
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-japanese text-lg"
          rows="2"
          placeholder="在这里输入你听到的日语..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="flex flex-wrap justify-end mt-2 gap-2">
          <button
            onClick={handleCheck}
            className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
          >
            <i className="fa fa-check mr-1"></i>检查答案
          </button>
          
          {showErrorButtons && (
            <>
              {/* 短播放按钮 - 粉色系 */}
              <button
                onClick={() => handlePlayError('shortPlayRange')}
                className="px-4 py-1.5 bg-shortPlay/10 text-shortPlay hover:bg-shortPlay hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
              >
                <i className="fa fa-volume-up mr-1"></i>短播放
              </button>
              
              {/* 助词按钮 - 青色系 */}
              <button
                onClick={() => handlePlayError('errorToParticleRange')}
                className="px-4 py-1.5 bg-particle/10 text-particle hover:bg-particle hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
              >
                <i className="fa fa-volume-up mr-1"></i>到助词为止
              </button>
              
              {/* 错误播放按钮 - 紫色系 */}
              <button
                onClick={() => handlePlayError('errorRange')}
                className="px-4 py-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center"
              >
                <i className="fa fa-volume-up mr-1"></i>从错误处播放
              </button>
            </>
          )}
        </div>
      </div>

      {/* 检查结果区域 */}
      {checkResult && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {checkResult.correct ? (
                <span className="text-success">
                  <i className="fa fa-check-circle mr-1"></i>回答正确
                </span>
              ) : (
                <span className="text-error">
                  <i className="fa fa-times-circle mr-1"></i>有错误
                </span>
              )}
            </span>
            <span className="text-xs text-neutral-500">
              准确率: {checkResult.accuracy.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-neutral-500">你的输入：</span>
              <div 
                className="font-japanese text-sm p-2 bg-neutral-50 rounded"
                dangerouslySetInnerHTML={{ __html: checkResult.userHtml }}
              />
            </div>
            <div>
              <span className="text-xs font-medium text-neutral-500">正确答案：</span>
              <div 
                className="font-japanese text-sm p-2 bg-neutral-50 rounded"
                dangerouslySetInnerHTML={{ __html: checkResult.correctHtml }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 日语原文（默认隐藏） */}
      {showOriginal && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-500 mb-1">日语原文</h4>
          <p className="font-japanese text-lg text-neutral-800">{sentence.text}</p>
        </div>
      )}

      {/* 中文翻译 */}
      <div>
        <h4 className="text-sm font-medium text-neutral-500 mb-1">中文翻译</h4>
        <p className="text-neutral-700">{sentence.chinese}</p>
      </div>
    </div>
  );
}

export default SentenceCard;
