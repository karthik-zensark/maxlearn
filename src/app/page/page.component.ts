import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
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
  scrollContainer: any;
  isNearBottom: boolean = false;
  ifItems: string[] = [];

  selectedCategory: any[] = [];
  filteredCategory: any = [];
  category: any[] = [
    { name: "Questions", id: "1" },
    { name: "Flashcards", id: "2" },
    { name: "Key Learning Points (KLPs)", id: "3" },
  ];

  showTopics: boolean = false;
  selectedTopic = { id: "", name: "" };
  filteredTopics: any = [];
  topics: any[] = [
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
  selectedQuestionNum = { number: "1", id: "1" };
  filteredQuestionNumbers: any[] = [];

  questionNumbers: any[] = [
    { number: "1", id: "1" },
    { number: "2", id: "2" },
    { number: "3", id: "3" },
    { number: "4", id: "4" },
    { number: "5", id: "5" },
  ];

  learningLevelObj = { name: "", key: "" };

  selectedLearningLevel: { name: ""; key: "" }[] = [];

  learningLevels: any[] = [
    { name: "Awareness", key: "A" },
    { name: "Explanatory", key: "M" },
    { name: "Practitioner", key: "P" },
  ];

  showLearningLevel: boolean = false;

  showClientInputTwo: boolean = false;
  clientInputTwo: string = "";
  clientInputTwoSkipped: boolean = true;

  finalQuestion: string = "";

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
    if (this.selectedCategory.length == 0) {
      this.showTopics = false;
    }
    if (this.selectedCategory.length != 0) {
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
    console.log("selectedCategory: ", this.selectedCategory);
    let filtered: any[] = [];
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
    let filtered: any[] = [];
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
    let filtered: any[] = [];
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
      this.finalQuestion = `Generate ${
        this.selectedQuestionNum.number
      } ${this.questionTagChanger(this.selectedQuestionNum.number)} on ${
        this.selectedTopic.name
      } with based on the content ${
        this.clientInputOne
      } supporting ${selectedNames.toString()}`;
    } else if (isInputOneSkipped) {
      this.finalQuestion = `Generate ${
        this.selectedQuestionNum.number
      } ${this.questionTagChanger(this.selectedQuestionNum.number)} on ${
        this.selectedTopic.name
      } with a focus on ${
        this.clientInputTwo
      } supporting ${selectedNames.toString()}`;
    }
    console.log("Final Question is: ", this.finalQuestion);
  }

  questionTagChanger(numberOfQuestions: string): string {
    if (parseInt(numberOfQuestions) > 1) {
      return "questions";
    } else {
      return "question";
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
  scrolled(event: any): void {
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

  sendToChatGptClient() {
    this.apiService.sendGeneratedQuestionApi(this.finalQuestion).subscribe(
      (response: any) => {
        console.log("Response from sendGeneratedQuestionApi() is: ", response);
        console.log("Successfully sent to chatGPT client :)");
      },
      (error) => {
        console.log(
          "There has been an error sending the generated question. err is: ",
          error
        );
      }
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
