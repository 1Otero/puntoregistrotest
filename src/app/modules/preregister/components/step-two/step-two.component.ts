import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IEvent } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AssistantService } from 'src/app/services/assistant.service';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent {

  status: RequestStatus = 'init';
  @Input() event: IEvent = {
    eventId: 0,
    modifiedUserId: 0,
    clientId: 0,
    name: '',
    status: 0,
    type: null,
    date: 0,
    date2: 0,
    imageId: 0,
    folderDocumentId: 0,
    phone: '',
    whatsapp: '',
    email: '',
    urlEvent: '',
    labelUrl: '',
    dateStartPreregistration: 0,
    dateEndPreregistration: 0,
    timezone: '',
    def: '',
    active: false,
    dateStartEvent: 0,
    dateEndEvent: 0,
    selectEvent: false,
    vottingTypeId: 0,
    dataBase: false,
    preregistration: false,
    registrationPoint: false,
    app: false,
    videoCall: false,
    typeEvent: 0,
    freeEvent: 0,
    codEvent: 0
  };
  formData: FormGroup;

  constructor(
    private fb: FormBuilder,
    private assistantService: AssistantService,
    private router: Router,
    private toastrService: ToastrService,
  ) { }


  ngOnInit() {
    this.formData = this.fb.group({
      tipoDocumento: ['1', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
    this.validator();
  }

  validator() {
    this.formData.get('tipoDocumento')?.valueChanges.subscribe((newIdTypeDoc) => {
      if (newIdTypeDoc === '1') {
        this.formData.get('numeroDocumento')?.setValidators([
          Validators.required, Validators.pattern(/^\d+$/)
        ]);
      } else if (newIdTypeDoc === '2') {
        this.formData.get('numeroDocumento')?.setValidators([
          Validators.required
        ]);
      } else {
        this.formData.get('numeroDocumento')?.setValidators([
          Validators.required
        ]);
      }
      this.formData.get('numeroDocumento')?.updateValueAndValidity();
    });
  }

  submitForm() {
    if (this.formData.valid) {
      this.status = 'loading';

      this.status = 'success';
    } else {
      this.formData.markAllAsTouched();
    }
  }
}
