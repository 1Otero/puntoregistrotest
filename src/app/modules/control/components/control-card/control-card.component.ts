import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IControl } from 'src/app/models/control.model';
import { ControlSaveComponent } from '../control-save/control-save.component';

interface IEstadoColor {
  estado: number;
  color: string;
  text: string;
}

@Component({
  selector: 'app-control-card',
  templateUrl: './control-card.component.html',
  styleUrls: ['./control-card.component.scss']
})
export class ControlCardComponent {

  estados: IEstadoColor[] = [
    {
      estado: 0,
      color: '#CD3232',
      text: 'white',
    },
    {
      estado: 1,
      color: 'white',
      text: 'black',
    },
    {
      estado: 2,
      color: '#7D7D7D',
      text: 'white',
    },
    {
      estado: 3,
      color: '#78C255',
      text: 'white',
    },
    {
      estado: 4,
      color: '#4097E5',
      text: 'white',
    },
    {
      estado: 5,
      color: '#E59340',
      text: 'white',
    },
  ];
  @Input() control: IControl = {
    idControl: 0,
    keyControl: 0,
    type: '',
    barCode: '',
    maker: '',
    model: '',
    purchaseDate: new Date(),
    batteryChangeDate: new Date(),
    lastEvent: '',
    lastUser: 0,
    lastAssistant: 0,
    description: '',
    physicalState: '',
    status: 0,
  };
  @Output() onControlEmit = new EventEmitter<IControl>();

  constructor(
    private dialog: Dialog
  ){}

  color(numeroColor: number) {
    let color: IEstadoColor =
    {
      estado: 0,
      color: '#CD3232',
      text: 'white',
    };
    this.estados.map(item => {
      if (item.estado === numeroColor) {
        color = item;
      }
    })
    return color;
  }

  onControl(){
    this.dialog.open<any>(ControlSaveComponent,
      {
        data: {
          control: this.control
        }
      }
    ).closed.subscribe(data => {
      if(data.rta){
        this.onControlEmit.emit(data.control);
      }
    });
  }

}
