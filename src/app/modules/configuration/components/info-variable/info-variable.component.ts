import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IConfigRegistrationPoint } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { InfoVariableService } from 'src/app/services/info-variable.service';

@Component({
  selector: 'app-info-variable',
  templateUrl: './info-variable.component.html',
  styleUrls: ['./info-variable.component.scss']
})
export class InfoVariableComponent implements OnInit, OnChanges {

  status: RequestStatus = 'init';
  statusDelete: RequestStatus = 'init';
  @Input() eventId: number = 0;
  @Input() listConfig: IConfigRegistrationPoint[] = [];
  createInfoVarable: IConfigRegistrationPoint = {
    configId: 0,
    creationDate: 0,
    eventId: 0,
    finalTime2: 0,
    habeasDataId: 0,
    name: '',
    type: 'pointRegister',
    value: 'true',
    dataType: 1
  };
  updateInfoVarable: IConfigRegistrationPoint = {
    configId: 0,
    creationDate: 0,
    eventId: 0,
    finalTime2: 0,
    habeasDataId: 0,
    name: '',
    type: 'pointRegister',
    value: 'true',
    dataType: 1
  };
  idDelete: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private infoVariableService: InfoVariableService
  ) { }

  formAll = new FormGroup({
    variables: this.formBuilder.array([])
  });

  ngOnInit(): void {
    this.fieldArray.clear();
    this.listConfig.map(item => {
      this.agregarCampoFromBack(item.configId, item.name, item.value, item.dataType);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fieldArray.clear();
    this.listConfig.map(item => {
      this.agregarCampoFromBack(item.configId, item.name, item.value, item.dataType);
    })
  }

  get fieldArray() {
    return this.formAll.get('variables') as FormArray;
  }

  agregarCampoFromBack(configId: number, titulo: string, show: string, dataType: number) {
    const nuevoCampo = this.formBuilder.group({
      configId: [configId],
      titulo: [titulo, [Validators.required]],
      tipoDato: [dataType],
      show: [show],
    });
    this.fieldArray.push(nuevoCampo);
  }

  saveVariable() {
    this.status = 'loading';
    this.createInfoVarable = {
      ... this.createInfoVarable,
      eventId: this.eventId,
    }
    this.infoVariableService.create(this.createInfoVarable).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.status = 'success'
        } else {
          this.status = 'failed';
        }
      },
      error: (error) => {
        console.error(error);
        this.status = 'failed';
      }
    })
  }

  deleteInfoVariable(configId: number) {
    this.statusDelete = 'loading';
    this.idDelete = configId;
    this.infoVariableService.delete(configId).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.statusDelete = 'success';
        } else {
          this.statusDelete = 'failed';
        }
      },
      error: (error) => {
        console.error(error);
        this.statusDelete = 'failed';
      }
    })
  }

  updateShowVariable(configId: number, name: string, show: string, dataType: string){
    this.updateInfoVarable = {
      ... this.updateInfoVarable,
      configId: configId,
      name: name,
      value: show === 'true' ? 'false' : 'true',
      dataType: Number(dataType)
    }
    this.infoVariableService.update(this.updateInfoVarable).subscribe({
      next: (data) => {
        if(data){

        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  updateShowVariable2(configId: number, name: string, show: string, dataType: string){
    this.updateInfoVarable = {
      ... this.updateInfoVarable,
      configId: configId,
      name: name,
      dataType: Number(dataType)
    }
    this.infoVariableService.update(this.updateInfoVarable).subscribe({
      next: (data) => {
        if(data){

        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  updateName(configId: number, name: string, show: string){
    this.updateInfoVarable = {
      ... this.updateInfoVarable,
      configId: configId,
      name: name,
      value: show,
    }
    this.infoVariableService.update(this.updateInfoVarable).subscribe({
      next: (data) => {
        if(data){

        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}
