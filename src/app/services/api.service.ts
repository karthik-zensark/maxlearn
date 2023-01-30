import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  url = environment.baseUrl;

  constructor(private http: HttpClient) {}

  sendGeneratedQuestionApi(generateFinalQuestion: string) {
    return this.http.post(
      `${this.url}?question=${generateFinalQuestion}`,
      {}
    );
  }
}
