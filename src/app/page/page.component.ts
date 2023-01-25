import { Component } from "@angular/core";

@Component({
  selector: "app-page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"],
})
export class PageComponent {
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
    { name: "Accounting", key: "A" },
    { name: "Marketing", key: "M" },
    { name: "Production", key: "P" },
    { name: "Research", key: "R" },
  ];

  showLearningLevel: boolean = false;

  showClientInputTwo: boolean = false;
  clientInputTwo: string = "";
  clientInputTwoSkipped: boolean = true;

  finalQuestion: string = "";

  ngOnInit(): void {}

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
    }
  }

  clientInputOneSkipper() {
    this.isClientInputOneDisabled = true;
    this.clientInputOneSkipped = true;
    this.showQuestionNumber = true;
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
    } else {
      this.showLearningLevel = false;
    }
  }

  learningLevelMethod() {
    console.log(this.clientInputOneSkipped);
    if (this.clientInputOneSkipped && this.selectedLearningLevel.length != 0) {
      this.showClientInputTwo = true;
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
      } questions on ${
        this.selectedTopic.name
      } with based on the content I entered supporting ${selectedNames.toString()}`;
    } else if (isInputOneSkipped) {
      this.finalQuestion = `Generate ${
        this.selectedQuestionNum.number
      } questions on ${this.selectedTopic.name} with a focus on ${
        this.clientInputTwo
      } supporting ${selectedNames.toString()}`;
    }
    console.log("Final Question is: ", this.finalQuestion);
  }
}
