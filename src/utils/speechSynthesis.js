// 日语朗读函数
export function speakJapanese(text, gender) {
  try {
    // 停止任何正在进行的朗读
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // 稍慢的语速，适合学习
    
    // 根据性别调整音调和音量
    if (gender === 'male') {
      utterance.pitch = 0.8; // 降低音调以显得更低沉（男性）
      utterance.volume = 1.0;
    } else if (gender === 'female') {
      utterance.pitch = 1.2; // 提高音调以显得更尖锐（女性）
      utterance.volume = 1.0;
    }
    
    // 尝试找到合适的语音
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    // 筛选日语语音
    const japaneseVoices = voices.filter(voice => 
      voice.lang.includes('ja') || voice.name.includes('Japanese')
    );
    
    if (japaneseVoices.length > 0) {
      // 根据性别选择语音
      if (gender === 'male') {
        selectedVoice = japaneseVoices.find(voice => 
          voice.name.toLowerCase().includes('male') || 
          voice.name.toLowerCase().includes('man') ||
          (voice.name.includes('Google') && !voice.name.includes('female'))
        );
      } else if (gender === 'female') {
        selectedVoice = japaneseVoices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman') ||
          voice.name.includes('female')
        );
      }
      
      // 如果没有找到对应性别的语音，使用第一个日语语音
      if (!selectedVoice) {
        selectedVoice = japaneseVoices[0];
      }
      
      utterance.voice = selectedVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('语音合成失败:', error);
    throw new Error('语音合成功能不可用，请检查浏览器设置');
  }
}

// 初始化语音合成
export function initSpeechSynthesis(callback) {
  window.speechSynthesis.onvoiceschanged = function() {
    console.log('语音合成已准备就绪');
    if (callback) callback();
  };
}
