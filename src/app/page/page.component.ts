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
    if (parseInt(numberOfQuestions) > 1) {
      finalString = numberOfQuestions + " " + finalString + "s";
    } else if (parseInt(numberOfQuestions) == 1) {
      finalString = numberOfQuestions + " " + finalString;
    }
    return finalString;
  }

  highlightTagProvider(selectedCategory: string): string {
    let highlightTag = "Highlight the correct answer and provide feedback.";
    if (this.selectedCategory.name === this.category[0].name) {
      return highlightTag;
    } else {
      return "";
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
    this.apiService.sendGeneratedQuestionApi(dataObj).subscribe({
      next: (response: any) => {
        console.log("Response from sendGeneratedQuestionApi() is: ", response);
        console.log("Successfully sent to chatGPT client :)");
        finalAnswer = response.data;
      },
      complete: () => {
        this.finalAnswer = finalAnswer;
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
    console.log("setGeneratedQuestion started..")
    let tempArr = this.finalAnswer.split("\n");
    this.scrollToBottom();
    console.log(tempArr);
    console.log(this.finalReplacedAnswer);
  }

  // onItemElementsChanged(): void {
  //   console.log("onItemElementsChanged triggered");
  //   this.isUserNearBottom();
  //   if (this.isNearBottom) {
  //     this.scrollToBottom();
  //   }
  // }
}
