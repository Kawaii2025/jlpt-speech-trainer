/**
 * 测试文件：验证句子处理逻辑
 * React版本 - 使用模块导入
 */

import { splitByPeriod, extractAndRemoveGenderPrefix } from '../utils/textProcessing.js';
import { defaultText } from '../utils/constants.js';

describe('日语句子处理测试', () => {
    test('splitByPeriod 应该按句号分割并保留标点符号', () => {
        const result = splitByPeriod(defaultText);
        
        // 打印结果以查看
        console.log('分割后的句子数量:', result.length);
        result.forEach((sentence, index) => {
            console.log(`${index + 1}. ${sentence}`);
        });
        
        // 验证分割结果
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toContain('。');
    });

    test('extractAndRemoveGenderPrefix 应该正确提取性别标识', () => {
        const sentences = splitByPeriod(defaultText);
        const processedSentences = sentences.map(sentence => {
            return extractAndRemoveGenderPrefix(sentence);
        });
        
        console.log('\n处理后的句子和性别标识:');
        processedSentences.forEach((item, index) => {
            console.log(`${index + 1}. [${item.gender || 'null'}] ${item.text}`);
        });
        
        // 验证至少有一些句子有性别标识
        const withGender = processedSentences.filter(s => s.gender !== null);
        expect(withGender.length).toBeGreaterThan(0);
    });

    test('验证处理流程的完整结果', () => {
        const sentences = splitByPeriod(defaultText);
        const sentenceData = [];
        const chineseSentences = [];
        
        sentences.forEach(sentence => {
            if (sentence.trim() !== '') {
                const { text: processedText, gender } = extractAndRemoveGenderPrefix(sentence);
                sentenceData.push({
                    text: processedText,
                    gender: gender,
                });
                chineseSentences.push('');
            }
        });
        
        console.log('\n最终处理结果:');
        console.log(`总句子数: ${sentenceData.length}`);
        sentenceData.forEach((sentence, index) => {
            console.log(`\n句子 ${index + 1}:`);
            console.log(`  性别: ${sentence.gender || '无'}`);
            console.log(`  内容: ${sentence.text}`);
        });
        
        expect(sentenceData.length).toBe(chineseSentences.length);
        expect(sentenceData.length).toBeGreaterThan(0);
    });

    test('检查换行符是否被正确处理', () => {
        const testText = `女の学生はこの後何
をしなければなりませんか。`;
        
        const result = splitByPeriod(testText);
        console.log('\n换行符处理测试:');
        console.log('输入:', JSON.stringify(testText));
        console.log('输出:', result);
        
        // 应该只有一个句子，且不含换行
        expect(result.length).toBe(1);
        expect(result[0]).not.toContain('\n');
        expect(result[0]).toBe('女の学生はこの後何をしなければなりませんか。');
    });

    test('检查性别标识提取是否正确', () => {
        const testCases = [
            { input: '女:これは何ですか。', expectedGender: 'female', expectedText: 'これは何ですか。' },
            { input: '男：わかりました。', expectedGender: 'male', expectedText: 'わかりました。' },
            { input: 'これは何ですか。', expectedGender: null, expectedText: 'これは何ですか。' },
        ];
        
        console.log('\n性别标识提取测试:');
        testCases.forEach((testCase, index) => {
            const result = extractAndRemoveGenderPrefix(testCase.input);
            console.log(`测试 ${index + 1}: ${testCase.input} -> [${result.gender}] ${result.text}`);
            expect(result.gender).toBe(testCase.expectedGender);
            expect(result.text).toBe(testCase.expectedText);
        });
    });

    test('验证性别继承逻辑', () => {
        const sentences = splitByPeriod(defaultText);
        const sentenceData = [];
        
        sentences.forEach(sentence => {
            if (sentence.trim() !== '') {
                const { text: processedText, gender } = extractAndRemoveGenderPrefix(sentence);
                sentenceData.push({
                    text: processedText,
                    gender: gender,
                });
            }
        });
        
        // 优化：无性别的句子继承前一个句子的性别
        for (let i = 0; i < sentenceData.length; i++) {
            if (!sentenceData[i].gender && i > 0) {
                // 向前查找最近的有性别的句子
                for (let j = i - 1; j >= 0; j--) {
                    if (sentenceData[j].gender) {
                        sentenceData[i].gender = sentenceData[j].gender;
                        break;
                    }
                }
            }
        }
        
        console.log('\n性别继承后的结果:');
        sentenceData.forEach((sentence, index) => {
            console.log(`${index + 1}. [${sentence.gender || '无'}] ${sentence.text}`);
        });
        
        // 验证除了第一个句子外，后续句子都应该有性别
        const sentencesWithGender = sentenceData.filter((s, i) => i === 0 || s.gender !== null);
        expect(sentencesWithGender.length).toBeGreaterThanOrEqual(sentenceData.length - 1);
    });

    test('验证正确的句子数量 (应该是17句)', () => {
        const sentences = splitByPeriod(defaultText);
        const sentenceData = [];
        
        sentences.forEach(sentence => {
            if (sentence.trim() !== '') {
                const { text: processedText, gender } = extractAndRemoveGenderPrefix(sentence);
                sentenceData.push({
                    text: processedText,
                    gender: gender,
                });
            }
        });
        
        console.log(`\n实际句子数量: ${sentenceData.length}`);
        expect(sentenceData.length).toBe(17);
    });
});
