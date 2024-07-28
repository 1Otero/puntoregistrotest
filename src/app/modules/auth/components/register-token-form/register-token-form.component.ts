import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RequestStatus } from 'src/app/models/request-status.model';

@Component({
  selector: 'app-register-token-form',
  templateUrl: './register-token-form.component.html',
  styleUrls: ['./register-token-form.component.scss']
})
export class RegisterTokenFormComponent {


  @Output() onToken = new EventEmitter<number>();
  @Input() status: RequestStatus = 'init';
  @Input() email: string = '';

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  form = this.formBuilder.nonNullable.group({
    token: ['', [Validators.required]],
  });

  register() {
    if(this.form.valid){
      const { token } = this.form.getRawValue();
      this.onToken.emit(Number(token));
    } else {
      this.form.markAllAsTouched();
    }
  }
}
