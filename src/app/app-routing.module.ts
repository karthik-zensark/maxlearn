import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinalComponent } from "./final/final.component";
import { PageComponent } from "./page/page.component";

const routes: Routes = [
  { path: "", component: PageComponent },
  { path: "final", component: FinalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
