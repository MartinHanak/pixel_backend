"use strict";
// get structured question from plain text chatGPT response
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAnswer = exports.extractOptions = exports.extractQuestion = void 0;
function getStructuredQuestion(input) {
    const question = extractQuestion(input);
    const options = extractOptions(input);
    const answer = extractAnswer(input);
    if (question && options && answer) {
        return {
            question: question,
            options: options,
            answer: answer
        };
    }
    else {
        return null;
    }
}
exports.default = getStructuredQuestion;
function extractQuestion(input) {
    const questionRegExp = /(Question\:)(\s+)?(\n)?(.*)/i;
    const match = input.match(questionRegExp);
    if (match) {
        return match[4];
    }
    else {
        return null;
    }
}
exports.extractQuestion = extractQuestion;
function extractOptions(input) {
    const optionsRegExp = /([A1][\)\.\:\-]\s*)(.+)(\n)(\n)?([B2][\)\.\:\-]\s*)(.+)(\n)(\n)?([C3][\)\.\:\-]\s*)(.+)(\n)(\n)?([D4][\)\.\:\-]\s*)(.+)(\n)(\n)?/i;
    const match = input.match(optionsRegExp);
    if (match) {
        const optionA = match[2];
        const optionB = match[6];
        const optionC = match[10];
        const optionD = match[14];
        return {
            A: optionA,
            B: optionB,
            C: optionC,
            D: optionD
        };
    }
    else {
        return null;
    }
}
exports.extractOptions = extractOptions;
function extractAnswer(input) {
    const answerRegExp = /(Answer:)(\s+)?(\n)?(\w)([\)\.\:\-])/i;
    const match = input.match(answerRegExp);
    if (match && (match[4] === "A" || match[4] === "B" || match[4] === "C" || match[4] === "D")) {
        return match[4];
    }
    else {
        return null;
    }
}
exports.extractAnswer = extractAnswer;
//# sourceMappingURL=extractStructuredQuestion.js.map