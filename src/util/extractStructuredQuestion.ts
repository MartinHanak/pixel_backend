// get structured question from plain text chatGPT response

// example response
//const exampleResponse = "Question: In what year did the Battle of Waterloo take place?\n\nA) 1805\nB) 1811\nC) 1815\nD) 1820\n\nAnswer: \nC) 1815"

interface OptionInterface {
    A: string,
    B: string,
    C: string,
    D: string
}

type answerType = "A" | "B" | "C" | "D";

interface StructuredQuestionInferface {
    question: string,
    options: OptionInterface,
    answer: answerType
}


export default function getStructuredQuestion(input: string) : StructuredQuestionInferface | null  {
    
    const question = extractQuestion(input);

    const options = extractOptions(input);

    const answer = extractAnswer(input);

    if (question && options && answer) {
        return {
            question: question,
            options: options,
            answer: answer
        }
    } else {
        return null;
    }
}



export function extractQuestion(input: string) : string  | null {
    const questionRegExp = /(Question\:)(\s+)?(\n)?(.*)/i;

    const match = input.match(questionRegExp);

    if(match) {
        return match[4];
    } else {
        return null;
    }

}


export function extractOptions(input: string) : OptionInterface  | null {

    const optionsRegExp = /([A1][\)\.\:\-]\s*)(.+)(\n)(\n)?([B2][\)\.\:\-]\s*)(.+)(\n)(\n)?([C3][\)\.\:\-]\s*)(.+)(\n)(\n)?([D4][\)\.\:\-]\s*)(.+)(\n)(\n)?/i

    const match = input.match(optionsRegExp);

    if(match) {
        const optionA = match[2];
        const optionB = match[6];
        const optionC = match[10];
        const optionD = match[14];

        return {
            A: optionA,
            B: optionB,
            C: optionC,
            D: optionD
        }
    } else {
        return null;
    }


}


export function extractAnswer(input: string) : answerType | null {
    const answerRegExp = /(Answer:)(\s+)?(\n)?(\w)([\)\.\:\-])/i;

    const match = input.match(answerRegExp);

    if(match  && (match[4] === "A" || match[4] === "B" || match[4] === "C" || match[4] === "D")) {
        return match[4];
    } else {
        return null
    }

}





