export interface sendGeneratedQuestionApiModel {
  query: string;
}

export interface sendGeneratedQuestionApiResponseModel {
  data: string;
  tokens: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}
