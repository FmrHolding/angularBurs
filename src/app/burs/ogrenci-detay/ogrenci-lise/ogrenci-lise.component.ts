import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Lise } from 'src/app/models/lise';

@Component({
  selector: 'app-ogrenci-lise',
  templateUrl: './ogrenci-lise.component.html',
  styles: [
  ]
})
export class OgrenciLiseComponent implements OnInit {

  public frmBursLise: FormGroup;
  @Input() lise?: Lise;
  @Output() driverToUpdate = new EventEmitter<Lise[]>();
  liseler:any;
  private ngUnsubscribe$ = new Subject<void>();
  
  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
  }

  setFrmBursLise(){
    this.frmBursLise = this.fb.group({
      id: [0, [Validators.required]],
      ogrenciid: [0, [Validators.required]],
      liseid: [0, [Validators.required]],
      liseturuid: [0, [Validators.required]],
      sinifid: [0, [Validators.required]]
    });
  }

  onUpdateDriver(lise:any):void{

  }

  onDeleteDriver(lise:any):void{

  }

  onCreateDriver(lise:any):void{

  }

  onSelectLise(event):void{

  }
}
