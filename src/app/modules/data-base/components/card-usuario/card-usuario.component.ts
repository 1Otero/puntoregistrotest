import { Component, Input, OnInit } from '@angular/core';
import { ITicketUser } from '../../../../models/ticket.model';
import { TypeDocService } from '../../../../services/type-doc.service';
import { ITypeDoc } from 'src/app/models/type-doc.model';

@Component({
  selector: 'app-card-usuario',
  templateUrl: './card-usuario.component.html',
  styleUrls: ['./card-usuario.component.scss']
})
export class CardUsuarioComponent implements OnInit{

  @Input() users: ITicketUser[] = [];
  typeDoc: string = '';
  listTypeDoc: ITypeDoc[] = [];

  constructor(
    private typeDocService: TypeDocService,
  ){}

  ngOnInit(): void {
    this.typeDocService.get().subscribe(data => {
      this.listTypeDoc = data.payload;
    });
  }

  changeTypeDoc(typeDocId: number){
    return this.listTypeDoc.find(item => item.idTypeDoc === typeDocId)?.abbreviate;
  }
}
