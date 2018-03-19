import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { Project } from "../project.model";

import { HttpService } from "../../../common/services/http.service";
import { APIResponse } from "../../../common/interfaces/api-response.interface";

@Component({
  selector: "project-dialog",
  templateUrl: "./project-dialog.component.html"
})

export class ProjectDialogComponent {
  @Input() isOpen;

  projectForm: FormGroup;
  
  project: Project;

  isPerformingAPICall: boolean;

  serverErrors = {};

  dialogTitle = "Create a new project";
  dialogContext: Object = {
    title: "New Project",
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
           Vestibulum vitae sollicitudin sapien. Morbi a nisi vulputate, congue nisl vitae, posuere ex. 
           Maecenas sollicitudin elit turpis, at condimentum felis varius malesuada.`
  };

  constructor(
    private formBuilder: FormBuilder, 
    private httpService: HttpService, 
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      title: ["", [ Validators.required ]]
    });
  }

  public onFormSubmit() {
    if (!this.projectForm.valid) return;

    this.project = this.projectForm.value;

    this.isPerformingAPICall = true;

    this.httpService.post('projects', this.project)
      .subscribe(
        (data: APIResponse) => {
          this.project = <Project> data.data;
          this.router.navigate(['/projects', this.project.id]);
          this.isOpen = false;
        },
        error => this.serverErrors = error,
        () => this.isPerformingAPICall = false
      )
  }

  get title() { 
    return this.projectForm.get('title'); 
  }
}
 