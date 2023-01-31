import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { sendGeneratedQuestionApiModel } from "../models/apiModels/api.model";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  url = environment.baseUrl;

  constructor(private http: HttpClient) {}

  sendGeneratedQuestionApi(
    generatedFinalQuestion: sendGeneratedQuestionApiModel
  ) {
    return this.http.post(`${this.url}/generate`, generatedFinalQuestion, {});
  }
}
