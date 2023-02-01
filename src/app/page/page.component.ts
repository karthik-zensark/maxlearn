import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import {
  generalDropdown,
  learningLevelDropdown,
  questionNumberDropdown,
} from "../models/pageModels/page.models";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"],
})
export class PageComponent implements AfterViewInit {
  @ViewChild("scrollFrame", { static: false })
  scrollFrame!: ElementRef;
  // @ViewChildren("scrollFrame") itemElements!: QueryList<any>;
  scrollContainer: ElementRef["nativeElement"];
  isNearBottom: boolean = false;
  ifItems: string[] = [];

  selectedCategory: generalDropdown = { id: "", name: "" };
  filteredCategory: generalDropdown[] = [];
  category: generalDropdown[] = [
    { name: "Questions", id: "1" },
    { name: "Flashcards", id: "2" },
    { name: "Key Learning Points (KLPs)", id: "3" },
  ];

  showTopics: boolean = false;
  selectedTopic: generalDropdown = { id: "", name: "" };
  filteredTopics: generalDropdown[] = [];
  topics: generalDropdown[] = [
    { name: "Anti-money Laundering", id: "1" },
    { name: "Fraud", id: "2" },
    { name: "Anti-bribery / Anti-corruption", id: "3" },
    { name: "Protecting Personally Identifiable information", id: "4" },
    { name: "HIAPAA", id: "5" },
    { name: "Other", id: "6" },
  ];

  showPara: boolean = false;
  clientInputOne: string = "";
  clientInputOneSkipped: boolean = true;
  isClientInputOneDisabled: boolean = false;
  showQuestionNumber: boolean = false;
  selectedQuestionNum: questionNumberDropdown = { number: "1", id: "1" };
  filteredQuestionNumbers: questionNumberDropdown[] = [];

  questionNumbers: questionNumberDropdown[] = [
    { number: "1", id: "1" },
    { number: "2", id: "2" },
    { number: "3", id: "3" },
    { number: "4", id: "4" },
    { number: "5", id: "5" },
  ];

  learningLevelObj: learningLevelDropdown = { name: "", key: "" };

  selectedLearningLevel: learningLevelDropdown[] = [];

  learningLevels: learningLevelDropdown[] = [
    { name: "Awareness", key: "A" },
    { name: "Explanatory", key: "M" },
    { name: "Practitioner", key: "P" },
  ];

  showLearningLevel: boolean = false;

  showClientInputTwo: boolean = false;
  clientInputTwo: string = "";
  clientInputTwoSkipped: boolean = true;

  finalQuestion: string = "";

  finalAnswer: string = "";
  finalReplacedAnswer: string = "";
  tokens = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0,
  };

  finalQuestionsArr: any[] = [];
  finalFlashcardsArr: any[] = [];
  finalKeypointsArr: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    // this.itemElements.changes.subscribe((_) => {
    //   console.log("syke");
    //   this.onItemElementsChanged();
    // });
  }

  showTopicsMethod() {
    if (this.selectedCategory.name.length == 0) {
      this.showTopics = false;
    }
    if (this.selectedCategory.name.length != 0) {
      this.showTopics = true;
    }
  }

  showParaMethod() {
    if (this.selectedTopic.name.length == 0) {
      this.showPara = false;
    }
    if (this.selectedTopic.name.length != 0) {
      this.showPara = true;
    }
  }

  filterCategory(event: any) {
    console.log(event);
    console.log("selectedCategory: ", this.selectedCategory);
    let filtered: generalDropdown[] = [];
    let query = event.query;
    for (let i = 0; i < this.category.length; i++) {
      let category = this.category[i];
      if (category.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category);
      }
    }
    this.filteredCategory = filtered;
    console.log("filteredCategory: ", this.filteredTopics);
  }

  filterTopic(event: any) {
    console.log("selectedTopic: ", this.selectedTopic);
    let filtered: generalDropdown[] = [];
    let query = event.query;
    for (let i = 0; i < this.topics.length; i++) {
      let topic = this.topics[i];
      if (topic.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(topic);
      }
    }
    this.filteredTopics = filtered;
    console.log("filteredTopics: ", this.filteredTopics);
  }

  clientInputOneMethod() {
    if (this.clientInputOne.length == 0) {
      this.clientInputOneSkipped = false;
      this.showQuestionNumber = false;
    } else if (this.clientInputOne.length != 0) {
      this.clientInputOneSkipped = false;
      this.showQuestionNumber = true;
      this.scrollToBottom();
    }
  }

  clientInputOneSkipper() {
    this.isClientInputOneDisabled = true;
    this.clientInputOneSkipped = true;
    this.showQuestionNumber = true;
    this.scrollToBottom();
  }

  filterQuestionNumber(event: any) {
    console.log("selectedQuestionNumbers: ", this.selectedQuestionNum);
    let filtered: questionNumberDropdown[] = [];
    let query = event.query;
    for (let i = 0; i < this.questionNumbers.length; i++) {
      let questionNumber = this.questionNumbers[i];
      if (
        questionNumber.number.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(questionNumber);
      }
    }
    this.filteredQuestionNumbers = filtered;
    console.log("filteredQuestionNumbers: ", this.filteredQuestionNumbers);
  }

  showLearningLevelMethod() {
    if (this.selectedQuestionNum.number.length != 0) {
      this.showLearningLevel = true;
      this.scrollToBottom();
    } else {
      this.showLearningLevel = false;
    }
  }

  learningLevelMethod() {
    console.log(this.clientInputOneSkipped);
    if (this.clientInputOneSkipped && this.selectedLearningLevel.length != 0) {
      this.showClientInputTwo = true;
      this.scrollToBottom();
    } else if (
      !this.clientInputOneSkipped &&
      this.selectedLearningLevel.length != 0
    ) {
      this.showClientInputTwo = false;
      this.generateFinalQuestion(this.clientInputOneSkipped);
    }
  }

  clientInputTwoMethod() {
    if (this.clientInputTwo.length != 0) {
      this.generateFinalQuestion(this.clientInputOneSkipped);
    }
  }

  generateFinalQuestion(isInputOneSkipped: boolean) {
    this.scrollToBottom();
    console.log("selectedQuestionNumber: ", this.selectedQuestionNum);
    console.log("selectedTopic: ", this.selectedTopic);
    console.log("clientInputOne: ", this.clientInputOne);
    console.log("selectedLearningLevel: ", this.selectedLearningLevel);
    const selectedNames: string[] = [];
    this.selectedLearningLevel.forEach((selectedLevel) => {
      selectedNames.push(selectedLevel.name);
    });
    console.log("selectedNames: ", selectedNames);
    if (!isInputOneSkipped) {
      this.finalQuestion = `Generate ${this.questionTagChanger(
        this.selectedQuestionNum.number,
        this.selectedCategory.name
      )} on ${this.selectedTopic.name} with based on the content ${
        this.clientInputOne
      } supporting ${selectedNames.toString()}. ${this.highlightTagProvider(
        this.selectedCategory.name
      )}`;
    } else if (isInputOneSkipped) {
      this.finalQuestion = `Generate ${this.questionTagChanger(
        this.selectedQuestionNum.number,
        this.selectedCategory.name
      )} on ${this.selectedTopic.name} with a focus on ${
        this.clientInputTwo
      } supporting ${selectedNames.toString()}. ${this.highlightTagProvider(
        this.selectedCategory.name
      )}`;
    }
    console.log("Final Question is: ", this.finalQuestion);
  }

  questionTagChanger(
    numberOfQuestions: string,
    selectedCategory: string
  ): string {
    let finalString: string = "Multiple Choice Questions";
    switch (selectedCategory) {
      case "Questions":
        finalString = "Multiple Choice Question";
        break;
      case "Flashcards":
        finalString = "Flashcard";
        break;
      case "Key Learning Points (KLPs)":
        finalString = "Key Learning Point";
        break;
      default:
        finalString = "Multiple Choice Questions";
    }
    if (
      parseInt(numberOfQuestions) > 1 &&
      finalString == "Multiple Choice Question"
    ) {
      finalString =
        numberOfQuestions +
        " " +
        finalString +
        "s" +
        " " +
        "With atleast 4 options Must state each question as 'Question:', option as 'Option:', answer as 'Answer:' and feedback as 'Feedback:'";
    } else if (
      parseInt(numberOfQuestions) == 1 &&
      finalString == "Multiple Choice Question"
    ) {
      finalString =
        numberOfQuestions +
        " " +
        finalString +
        " " +
        "With atleast 4 options Must state question as 'Question:', option as 'Option:', answer as 'Answer:' and feedback as 'Feedback:'";
    } else if (parseInt(numberOfQuestions) > 1 && finalString == "Flashcard") {
      finalString =
        numberOfQuestions +
        " " +
        finalString +
        "s" +
        " " +
        "Stating question as 'Question:' and answer as 'Answer:'";
    } else if (parseInt(numberOfQuestions) == 1 && finalString == "Flashcard") {
      finalString =
        numberOfQuestions +
        " " +
        finalString +
        " " +
        "Stating question as 'Question:' and answer as 'Answer:'";
    } else if (parseInt(numberOfQuestions) > 1) {
      finalString =
        numberOfQuestions +
        " " +
        finalString +
        "s" +
        " " +
        "Stating every point as 'Keypoint:'";
    } else {
      finalString =
        numberOfQuestions +
        " " +
        finalString +
        " " +
        "Stating every point as 'Keypoint:'";
    }
    return finalString;
  }

  highlightTagProvider(selectedCategory: string): string {
    // ** asking chatGPT to provide response in a formatted HTML structure
    // let highlightTag =
    // "Highlight the correct answer and provide feedback. and structure the response in a html document";
    // ** without formatting the response in HTML
    let highlightTag =
      "Must Highlight the correct answer and provide feedback.";
    if (this.selectedCategory.name === this.category[0].name) {
      return highlightTag;
    } else {
      // ** asking chatGPT to provide response in a formatted HTML structure
      // return "and structure the response in a html document";
      // ** without formatting the response in HTML
      return " ";
    }
  }

  // @HostListener("window:scroll", [])
  isUserNearBottom(): boolean {
    const threshold = 1000;
    // const position =
    //   this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const position = window.scrollY + window.innerHeight; // <- Measure position differently
    // const height = this.scrollContainer.scrollHeight;
    const height = document.body.scrollHeight;
    // <- Measure height differently
    console.log(position, height - threshold);
    return position > height - threshold;
  }

  @HostListener("window:scroll", ["$event"]) // <- Add scroll listener to window
  scrolled(event: Event): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.isNearBottom = this.isUserNearBottom();
      // console.log("is near bottom ? ", this.isNearBottom);
      if (this.isNearBottom) {
        window.scroll({
          // <- Scroll window instead of scrollContainer
          top: this.scrollContainer.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
      }
    }, 20);
  }

  // TODO: Working on deprecation issue RxJS subscribe, signature taking separate callback arguments.
  // sendToChatGptClient() {
  //   this.apiService.sendGeneratedQuestionApi(this.finalQuestion).subscribe(
  //     (response: any) => {
  //       console.log("Response from sendGeneratedQuestionApi() is: ", response);
  //       console.log("Successfully sent to chatGPT client :)");
  //     },
  //     (error) => {
  //       console.log(
  //         "There has been an error sending the generated question. err is: ",
  //         error
  //       );
  //     }
  //   );
  // }

  // ** Revert to above TODO mentioned method if this doesn't work. Tried to solved deprecation issue.
  sendToChatGptClient() {
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
    this.scrollToBottom();
    console.log(tempArr);
    console.log(this.finalReplacedAnswer);
    this.scrollToBottom();
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

  // onItemElementsChanged(): void {
  //   console.log("onItemElementsChanged triggered");
  //   this.isUserNearBottom();
  //   if (this.isNearBottom) {
  //     this.scrollToBottom();
  //   }
  // }
}
