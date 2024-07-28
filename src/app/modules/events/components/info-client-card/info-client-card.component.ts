import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { IConfigRegistrationPoint, IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AssistantService } from 'src/app/services/assistant.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';

interface DataUser {
  id: string;
  name: string,
  value: string,
}

@Component({
  selector: 'app-info-client-card',
  templateUrl: './info-client-card.component.html',
  styleUrls: ['./info-client-card.component.scss']
})
export class InfoClientCardComponent implements OnChanges, OnInit {

  status: RequestStatus = 'init';
  @Input() attendant: IUserAssistant = {
    userId: null,
    clientId: 0,
    loadListId: null,
    idTypeDoc: 0,
    docId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    secondLastName: "",
    email: "",
    phoneNumber: "",
    birthday: 0,
    gender: "",
    rh: null,
    eventId: 0,
    agreedToTermsOfUse: null,
    viewAccessPoint: null,
    register: false,
    registration: 0,
    registerPoint: false,
    errorMessage: null,
    infoVariable: '',
    logdel: true,
  };
  @Input() listConfig: IConfigRegistrationPoint[] = [];
  formAll = new FormGroup({
    variables: this.formBuilder.array([])
  });
  @Input() eventConfig: IEventConfig = {
    event: {
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
    },
    configRegistrationPoint: {
      configRegistrationPointId: 0,
      eventId: 0,
      isPublic: 0,
      deviceType: 0,
      vottingType: 0,
      email: 0,
      phone: 0,
      print: 0,
      showInfoClient: 0,
      coefficient: 0,
      units: 0,
      nominal: 0,
    }
  };
  @Input() messageInfoCliente: string = '';
  messageInfoClienteThis: string = '';
  @Output() clearMessage = new EventEmitter<string>();
  @Output() formValid = new EventEmitter<boolean>(false);
  user: IUserAdmin | null = null;
  adminUserId: number;

  constructor(
    private formBuilder: FormBuilder,
    private assistantService: AssistantService,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(data => {
      if(data){
        this.user = data;
        this.adminUserId = this.user.adminUserId;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.messageInfoClienteThis = this.messageInfoCliente;
    this.fieldArray.clear();
    let infoUser: DataUser[];
    if (this.attendant.infoVariable) {
      infoUser = JSON.parse(this.attendant.infoVariable);
    } else {
      infoUser = [];
    }
    if (this.eventConfig.configRegistrationPoint.email === 1) {
      this.agregarCampoFromBack('0000', 'Correo', this.attendant.email, 'true', 4);
    }
    if (this.eventConfig.configRegistrationPoint.phone === 1) {
      this.agregarCampoFromBack('0001', 'Celular', this.attendant.phoneNumber, 'true', 1);
    }
    this.listConfig.map((item, index) => {
      if (item.value === 'true') {
        if (infoUser) {
          const matchingUser = infoUser.find(userItem => userItem.id === item.configId.toString());
          if (matchingUser) {
            this.agregarCampoFromBack(item.configId.toString(), item.name, matchingUser.value, item.value, item.dataType);
          } else {
            this.agregarCampoFromBack(item.configId.toString(), item.name, '', item.value, item.dataType);
          }
        } else {
          this.agregarCampoFromBack(item.configId.toString(), item.name, '', item.value, item.dataType);
        }
      }
    })
    this.formValid.emit(this.formAll.valid);
  }

  get fieldArray() {
    return this.formAll.get('variables') as FormArray;
  }

  agregarCampoFromBack(id: string, name: string, value: string, show: string, dataType: number) {
    let validators = [Validators.required];
    if(dataType === 4){
      validators.push(Validators.email);
    }
    const nuevoCampo = this.formBuilder.group({
      id: [id],
      name: [name],
      show: [show],
      dataType: [dataType],
      value: [value, validators],
    });
    this.fieldArray.push(nuevoCampo);
  }

  saveCampos() {
    if (this.formAll.valid) {
      this.status = 'loading';
      let info = [];
      let infoCorreo = '';
      let infoTelefono = '';
      for (let i = 0; i < this.fieldArray.length; i++) {
        const variables = this.fieldArray.at(i) as FormGroup;
        const id = variables.get('id')?.value;
        if (id === '0000') {
          const value = variables.get('value')?.value;
          infoCorreo = value;
        } else if (id === '0001') {
          const value = variables.get('value')?.value;
          infoTelefono = value;
        } else {
          const name = variables.get('name')?.value;
          const value = variables.get('value')?.value;
          info.push({
            id: id,
            name: name,
            value: value
          });
        }
      }
      const infoString = JSON.stringify(info);
      this.attendant = {
        ... this.attendant,
        email: infoCorreo === '' ? this.attendant.email : infoCorreo,
        phoneNumber: infoTelefono === '' ? this.attendant.phoneNumber : infoTelefono,
        infoVariable: infoString
      };
      this.assistantService.update(this.attendant, this.adminUserId).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            this.toastrService.success('Registrado correctamente');
            this.status = 'success';
          } else {
            this.status = 'failed';
            this.toastrService.info(data.errorMessage.message);
          }
        },
        error: (error) => {
          console.error(error);
          this.status = 'failed';
          this.toastrService.error(environment.messageError);
        }
      })

    } else {
      this.formAll.markAllAsTouched();
    }
  }

  onClearMessage(){
    this.clearMessage.emit('');
  }
}
