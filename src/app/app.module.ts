import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { PageComponent } from "./page/page.component";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CheckboxModule } from "primeng/checkbox";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { AccordionModule } from "primeng/accordion"; //accordion and accordion tab
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { FinalComponent } from "./final/final.component";

@NgModule({
  declarations: [AppComponent, PageComponent, FinalComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AutoCompleteModule,
    CheckboxModule,
    ProgressSpinnerModule,
    FormsModule,
    InputTextModule,
    AccordionModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
