import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { PageComponent } from "./page/page.component";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { AccordionModule } from "primeng/accordion"; //accordion and accordion tab
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [AppComponent, PageComponent],
  imports: [
    BrowserModule,
    AutoCompleteModule,
    CheckboxModule,
    FormsModule,
    AccordionModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
