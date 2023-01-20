import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  selectedCategory: any[] = [];
  filteredCategory: any = [];
  category: any[] = [
    { name: 'Questions', id: '1' },
    { name: 'Flashcards', id: '2' },
    { name: 'Key Learning Points (KLPs)', id: '3' },
  ];

  showTopics: boolean = false;
  selectedTopic: any[] = [];
  filteredTopics: any = [];
  topics: any[] = [
    { name: 'Anti-money Laundering', id: '1' },
    { name: 'Fraud', id: '2' },
    { name: 'Anti-bribery / Anti-corruption', id: '3' },
    { name: 'Protecting Personally Identifiable information', id: '4' },
    { name: 'HIAPAA', id: '5' },
    { name: 'Other', id: '6' },
  ];

  showPara: boolean = false;

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
    if (this.selectedTopic.length == 0) {
      this.showPara = false;
    }
    if (this.selectedTopic.length != 0) {
      this.showPara = true;
    }
  }

  filterCategory(event: any) {
    console.log('selectedCategory: ', this.selectedCategory);
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.category.length; i++) {
      let category = this.category[i];
      if (category.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category);
      }
    }
    this.filteredCategory = filtered;
    console.log('filteredCategory: ', this.filteredTopics);
  }

  filterTopic(event: any) {
    console.log('selectedTopic: ', this.selectedTopic);
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.topics.length; i++) {
      let topic = this.topics[i];
      if (topic.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(topic);
      }
    }
    this.filteredTopics = filtered;
    console.log('filteredTopics: ', this.filteredTopics);
  }
}
