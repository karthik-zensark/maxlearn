import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { sendGeneratedQuestionApiModel } from "../models/apiModels/api.model";
import { generalDropdown, learningLevelDropdown, questionNumberDropdown } from "../models/pageModels/page.models";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  selectedCategory: generalDropdown = { id: "", name: "" };
  selectedTopic: generalDropdown = { id: "", name: "" };
  selectedQuestionNum: questionNumberDropdown = { number: "1", id: "1" };
  learningLevelObj: learningLevelDropdown = { name: "", key: "" };
  selectedLearningLevel: learningLevelDropdown[] = [];

  generatedQuestion: string = "";

  finalQuestionsArr: any[] = [];
  finalFlashcardsArr: any[] = [];
  finalKeypointsArr: any[] = [];


  url = environment.baseUrl;

  constructor(private http: HttpClient) {}

  sendGeneratedQuestionApi(
    generatedFinalQuestion: sendGeneratedQuestionApiModel
  ) {
    return this.http.post(`${this.url}/generate`, generatedFinalQuestion, {});
  }
}
