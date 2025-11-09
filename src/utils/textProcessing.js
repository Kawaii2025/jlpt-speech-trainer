// 判断文本是否包含日语字符
export function containsJapanese(text) {
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
  return japaneseRegex.test(text);
}

// 按句号分割句子（。！？）并保留标点符号，也在性别标识处分割
export function splitByPeriod(text) {
  // 先去掉换行符（换行符之间没有真实的空格）
  const cleanedText = text.replace(/\n+/g, '').trim();
  
  // 先按句号、感叹号、问号分割，但保留标点符号
  let sentences = cleanedText.split(/(?<=[。！？])/);
  
  // 再按性别标识分割（女: 、男: 、女： 、男：）
  sentences = sentences.flatMap(sentence => {
    return sentence.split(/(?=[女男男女][：:])/);
  });
  
  return sentences
    .map(s => s.trim())
    .filter(s => s !== '');
}

// 提取并去除开头的性别标识
export function extractAndRemoveGenderPrefix(text) {
  const genderMatch = text.match(/^([男女男女])([:：])/);
  
  if (genderMatch) {
    const gender = genderMatch[1];
    const processedText = text.replace(/^[男女男女][:：]/, '').trim();
    return {
      text: processedText,
      gender: gender === '男' || gender === '男' ? 'male' : 'female'
    };
  }
  
  return {
    text: text.trim(),
    gender: null
  };
}

// 查找从指定位置开始的下一个助词位置
export function findNextParticlePosition(text, startPos, particles) {
  // 从起始位置开始检查每个字符
  for (let i = startPos; i < text.length; i++) {
    // 检查当前字符是否是助词
    if (particles.includes(text[i])) {
      return i;
    }
    
    // 检查是否是双字符助词（如"って"）
    if (i < text.length - 1) {
      const twoChars = text[i] + text[i + 1];
      if (particles.includes(twoChars)) {
        return i + 1; // 返回双字符助词的结束位置
      }
    }
  }
  
  // 如果没有找到助词，返回文本末尾
  return text.length - 1;
}

// 查找从指定位置开始的第N个助词位置
export function findNthParticlePosition(text, startPos, count, particles) {
  let particleCount = 0;
  let lastPosition = startPos;
  
  // 从起始位置开始检查每个字符
  for (let i = startPos; i < text.length; i++) {
    // 检查当前字符是否是助词
    if (particles.includes(text[i])) {
      particleCount++;
      lastPosition = i;
      if (particleCount >= count) {
        return lastPosition;
      }
    }
    
    // 检查是否是双字符助词（如"って"）
    if (i < text.length - 1) {
      const twoChars = text[i] + text[i + 1];
      if (particles.includes(twoChars)) {
        particleCount++;
        lastPosition = i + 1;
        if (particleCount >= count) {
          return lastPosition;
        }
        i++; // 跳过已处理的第二个字符
      }
    }
  }
  
  // 如果找到的助词不足N个，返回文本末尾
  return text.length - 1;
}

// 比较文本并记录错误位置
export function compareTexts(userText, originalText) {
  let userHtml = '';
  let correctHtml = '';
  let correctCount = 0;
  let errorPositions = []; // 记录错误位置
  const maxLength = Math.max(userText.length, originalText.length);
  
  for (let i = 0; i < maxLength; i++) {
    const userChar = i < userText.length ? userText[i] : '';
    const originalChar = i < originalText.length ? originalText[i] : '';
    
    if (userChar === originalChar && userChar !== '') {
      // 字符正确
      userHtml += `<span class="correct-char">${userChar}</span>`;
      correctHtml += `<span class="correct-char">${originalChar}</span>`;
      correctCount++;
    } else {
      // 字符错误，记录位置
      errorPositions.push(i);
      
      if (userChar && originalChar) {
        // 替换错误
        userHtml += `<span class="incorrect-char">${userChar}</span>`;
        correctHtml += `<span class="incorrect-char">${originalChar}</span>`;
      } else if (userChar && !originalChar) {
        // 插入错误
        userHtml += `<span class="extra-char">${userChar}</span>`;
      } else if (!userChar && originalChar) {
        // 删除错误
        userHtml += `<span class="missing-char"> </span>`;
        correctHtml += `<span class="missing-char">${originalChar}</span>`;
      }
    }
  }
  
  const accuracy = originalText.length > 0 ? (correctCount / originalText.length) * 100 : 0;
  const correct = accuracy === 100;
  
  return {
    userHtml: userHtml,
    correctHtml: correctHtml,
    accuracy: accuracy,
    correct: correct,
    errorPositions: errorPositions
  };
}
