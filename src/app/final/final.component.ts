import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  generalDropdown,
  learningLevelDropdown,
  questionNumberDropdown,
} from "../models/pageModels/page.models";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-final",
  templateUrl: "./final.component.html",
  styleUrls: ["./final.component.scss"],
})
export class FinalComponent implements OnInit {
  selectedCategory: generalDropdown = { id: "", name: "" };
  selectedTopic: generalDropdown = { id: "", name: "" };
  selectedQuestionNum: questionNumberDropdown = { number: "1", id: "1" };
  learningLevelObj: learningLevelDropdown = { name: "", key: "" };
  selectedLearningLevel: learningLevelDropdown[] = [];

  finalQuestion: string = "";
  finalAnswer: string = "";

  showLoader: boolean = false;

  finalQuestionsArr: any[] = [];
  revertFinalQuestionsArr: any[] = [];
  finalFlashcardsArr: any[] = [];
  revertFlashcardsArr: any[] = [];
  finalKeypointsArr: any[] = [];
  revertKeyPointsArr: any[] = [];

  formHandlerArr: number[] = [];

  tokens = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0,
  };

  maxLearnArray: any[] = [];

  constructor(private apiService: ApiService, public router: Router) {}

  ngOnInit(): void {
    this.setInitValues();
  }

  setInitValues() {
    this.finalQuestion = this.apiService.generatedQuestion;
    setTimeout(() => {
      if (this.finalQuestion.length < 1) {
        this.router.navigate([""]);
      }
    }, 3000);

    this.selectedCategory = this.apiService.selectedCategory;
    this.selectedTopic = this.apiService.selectedTopic;
    this.selectedQuestionNum = this.apiService.selectedQuestionNum;
    this.selectedLearningLevel = this.apiService.selectedLearningLevel;
    this.setFormHandlerArr();

    this.sendToChatGptClient();
  }

  // ** Revert to above TODO mentioned method if this doesn't work. Tried to solved deprecation issue.
  sendToChatGptClient() {
    this.emptyAllFinalArrays();
    this.showLoader = true;
    const dataObj = {
      query: this.finalQuestion,
    };
    console.log(dataObj);
    let finalAnswer = "";
    let finalTokens = {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
    };
    this.apiService.sendGeneratedQuestionApi(dataObj).subscribe({
      next: (response: any) => {
        console.log("Response from sendGeneratedQuestionApi() is: ", response);
        console.log("Successfully sent to chatGPT client :)");
        finalAnswer = response.data;
        finalTokens = response.tokens;
      },
      complete: () => {
        this.finalAnswer = finalAnswer;
        this.tokens.completion_tokens = finalTokens.completion_tokens;
        this.tokens.prompt_tokens = finalTokens.prompt_tokens;
        this.tokens.total_tokens = finalTokens.total_tokens;
        console.log(this.finalAnswer);
        this.setGeneratedQuestion(this.finalAnswer);
      },
      error(error: any) {
        console.log(
          "There has been an error sending the generated question. err is: ",
          error
        );
      },
    });
  }

  setGeneratedQuestion(recievedQuestion: string) {
    console.log("setGeneratedQuestion started..");
    // ** Code for replacing /n with </br>
    // this.finalReplacedAnswer = this.finalAnswer.replace(
    //   /\n{2}/g,
    //   "<b></br></br></br>"
    // );
    // this.finalReplacedAnswer = this.finalReplacedAnswer.replace(
    //   /\n/g,
    //   "</br></br>"
    // );
    // ** Code for Splitting the response into several required arrays instead of adding <br>
    let tempArr = this.finalAnswer.split("\n");
    let questionsArr: any[] = [];
    let flashcardsArr: any[] = [];
    let keyPointsArr: any[] = [];
    let tempQuestionArr: any[] = [];
    let tempFlashcardsArr: any[] = [];
    let tempKeypointsArr: any[] = [];
    tempArr.forEach((ele, eleIndex) => {
      if (this.selectedCategory.name == "Questions") {
        let isQuestion = ele.search(/^(Q|q)uestion|^(Q|q)/);
        let isOption = ele.search(
          /^(O|o)ption|^.[a-d]|^[a-d]|^[a-d].|^.[A-D]|^[A-D]|^[A-D].|^.[1-4]|^[1-4]|^[1-4]./
        );
        let isAnswer = ele.search(/^(A|a)nswer/);
        let isFeedback = ele.search(/^(F|f)eedback/);
        if (isQuestion == 0) {
          let question = { question: ele };
          tempQuestionArr.push(question);
        } else if (isAnswer == 0) {
          let answer = { answer: ele };
          tempQuestionArr.push(answer);
        } else if (isOption == 0) {
          let optionArr: any[] = [];
          let options = { options: optionArr };
          options.options.push(ele);
          tempQuestionArr.push(options);
        } else if (isFeedback == 0) {
          let feedback = { feedback: ele };
          tempQuestionArr.push(feedback);
          questionsArr.push(tempQuestionArr);
          tempQuestionArr = [];
        }
      } else if (this.selectedCategory.name == "Flashcards") {
        let isQuestion = ele.search(/^(Q|q)uestion|^(Q|q)/);
        let isAnswer = ele.search(/^(A|a)nswer/);
        if (isQuestion == 0) {
          let question = { question: ele };
          tempFlashcardsArr.push(question);
        } else if (isAnswer == 0) {
          let answer = { answer: ele };
          tempFlashcardsArr.push(answer);
          flashcardsArr.push(tempFlashcardsArr);
          tempFlashcardsArr = [];
        }
      } else if (this.selectedCategory.name == "Key Learning Points (KLPs)") {
        let isKey = ele.search(/^(K|k)ey/);
        if (isKey == 0) {
          let keyPoint = { keyPoint: ele };
          tempKeypointsArr.push(keyPoint);
          keyPointsArr.push(tempKeypointsArr);
          tempKeypointsArr = [];
        }
      }
    });
    console.log("Question Array ----------> ", questionsArr);
    this.questionArraySetter(questionsArr);
    console.log("Flashcards Array ----------> ", flashcardsArr);
    this.flashCardsArraySetter(flashcardsArr);
    console.log("Key Points Array ----------> ", keyPointsArr);
    this.keyPointsArraySetter(keyPointsArr);
    this.showLoader = false;
    // this.scrollToBottom();
    console.log(tempArr);
    // console.log(this.finalReplacedAnswer);
  }

  questionArraySetter(questionsArray: any[]) {
    let tempQuestionsArr: any[] = [];
    questionsArray.forEach((questionArray, questionArrayIndex) => {
      let tempQuestionArray: any[] = [];
      let optionsArr: any[] = [];
      let options = { options: optionsArr };
      questionArray.forEach((ele: any, eleIndex: number) => {
        console.log(Object.keys(ele)[0]);
        let question = { question: "" };
        let answer = { answer: "" };
        let feedback = { feedback: "" };
        let keyName: string = Object.keys(ele)[0];
        if (keyName == "question" || keyName == "Question") {
          console.log(ele.question);
          let replacedQuestion: string = ele.question.replace(
            /^(Q|q)uestion:|^(Q|q)uestion/,
            ""
          );
          question.question = replacedQuestion;
          tempQuestionArray.push(question);
        }
        if (
          keyName == "option" ||
          keyName == "Option" ||
          keyName == "options" ||
          keyName == "Options"
        ) {
          console.log(ele);
          // let isOption = ele.options[0].search(
          //   /^Option|^option|^[a-d]|^[A-D]|^[1-4]/
          // );
          // if (isOption == 0) {
          let replacedOption: string = ele.options[0].replace(
            /^(O|o)ption:|^(O|o)ption|^(O|o)ption\s([A-D]|[a-d]|[1-4]):|^(O|o)ption\s([A-D]|[a-d]|[1-4])/,
            ""
          );
          options.options.push(replacedOption);
          // }
        }
        if (keyName == "answer" || keyName == "Answer") {
          let replacedAnswer: string = ele.answer.replace(
            /^(A|a)nswer:|^(A|a)nswer/,
            ""
          );
          answer.answer = replacedAnswer;
          tempQuestionArray.push(options);
          tempQuestionArray.push(answer);
        }
        if (keyName == "feedback" || keyName == "Feedback") {
          // let replacedKeypoint: string = ele.feedback.replace(
          //   /^(K|k)eypoint:|^(K|k)eypoint|^(K|k)ey\spoint|^(K|k)ey\sPoint/,
          //   ""
          // );
          let replacedFeedback: string = ele.feedback.replace(
            /^(F|f)eedback:|^(F|f)eedback/,
            ""
          );
          feedback.feedback = replacedFeedback;
          tempQuestionArray.push(feedback);
        }
      });
      tempQuestionsArr.push(tempQuestionArray);
    });
    this.finalQuestionsArr = tempQuestionsArr;
    console.log(
      "FInal question array arr: ----------> ",
      this.finalQuestionsArr
    );
  }

  flashCardsArraySetter(flashCardsArray: any[]) {
    let tempFlashCardsArr: any[] = [];
    flashCardsArray.forEach((flashCard, flashCardIndex) => {
      let tempFlashCardArray: any[] = [];
      flashCard.forEach((ele: any, eleIndex: any) => {
        let question = { question: "" };
        let answer = { answer: "" };
        let keyName: string = Object.keys(ele)[0];
        console.log(keyName);
        if (
          keyName === "question" ||
          keyName === "Question" ||
          keyName === "questions" ||
          keyName === "Questions"
        ) {
          console.log(ele.question);
          let replacedQuestion: string = ele.question.replace(
            /^(Q|q)uestion:|^(Q|q)uestion/,
            ""
          );
          question.question = replacedQuestion;
          tempFlashCardArray.push(question);
        } else if (
          keyName === "answer" ||
          keyName === "Answer" ||
          keyName === "answers" ||
          keyName === "Answers"
        ) {
          console.log(ele.answer);
          let replacedAnswer: string = ele.answer.replace(
            /^(A|a)nswer:|^(A|a)nswer/,
            ""
          );
          answer.answer = replacedAnswer;
          tempFlashCardArray.push(answer);
        }
      });
      tempFlashCardsArr.push(tempFlashCardArray);
    });
    this.finalFlashcardsArr = tempFlashCardsArr;
    console.log(
      "FInal Flash Cards array arr: ----------> ",
      this.finalFlashcardsArr
    );
  }

  keyPointsArraySetter(keyPointsArray: any[]) {
    let tempKeyPointsArr: any[] = [];
    keyPointsArray.forEach((keyPoint, keyPointIndex) => {
      let tempKeyPointArray: any[] = [];
      keyPoint.forEach((ele: any, eleIndex: any) => {
        let keyPoint = { keyPoint: "" };
        let keyName: string = Object.keys(ele)[0];
        console.log(keyName);
        if (
          keyName === "keyPoint" ||
          keyName === "KeyPoint" ||
          keyName === "keyPoints" ||
          keyName === "KeyPoints"
        ) {
          console.log(ele.keyPoint);
          let replacedKeyPoint: string = ele.keyPoint.replace(
            /^(K|k)ey(P|p)oint:|^(K|k)ey(P|p)oint/,
            ""
          );
          keyPoint.keyPoint = replacedKeyPoint;
          tempKeyPointArray.push(keyPoint);
        }
      });
      tempKeyPointsArr.push(tempKeyPointArray);
    });
    this.finalKeypointsArr = tempKeyPointsArr;
    console.log(
      "FInal key points array arr: ----------> ",
      this.finalKeypointsArr
    );
  }

  emptyAllFinalArrays() {
    this.finalQuestionsArr = [];
    this.finalFlashcardsArr = [];
    this.finalKeypointsArr = [];
  }

  setFormHandlerArr() {
    let numberOfForms: number = parseInt(this.selectedQuestionNum.number);
    for (let i = 0; i < numberOfForms; i++) {
      this.formHandlerArr.push(0);
    }
  }

  editFormTrigger(index: number) {
    this.formHandlerArr[index] = 1;
    this.revertFinalQuestionsArr = this.finalQuestionsArr;
    console.log(this.revertFinalQuestionsArr);
  }

  deleteQuestion(index: number) {
    this.finalQuestionsArr.splice(index, 1);
    console.log(this.finalQuestionsArr);
  }

  deleteFlashcard(index: number) {
    this.finalFlashcardsArr.splice(index, 1);
    console.log(this.finalFlashcardsArr);
  }

  deleteKeyPoint(index: number) {
    this.finalKeypointsArr.splice(index, 1);
    console.log(this.finalKeypointsArr);
  }

  formRemover(index: number) {
    this.formHandlerArr[index] = 0;
  }

  setItems() {
    console.log(this.finalQuestionsArr);
    console.log(this.revertFinalQuestionsArr);
  }

  pushToMaxLearnArr(arrName: string, index: number) {
    let takeArr: any[] = [];
    if (arrName === "questions") {
      takeArr = this.finalQuestionsArr;
    } else if (arrName === "flashCards") {
      takeArr = this.finalFlashcardsArr;
    } else if (arrName === "keyPoints") {
      takeArr = this.finalKeypointsArr;
    }
    this.maxLearnArray.push(takeArr[index]);
  }
}
