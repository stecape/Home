import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import template from './trends-form.component.html';
 
@Component({
  selector: 'trends-form',
  template
})
export class TrendsFormComponent implements OnInit {
  timeSpanDefForm: FormGroup;

  @Output() onSubmitted = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder
  ) {}
 
  ngOnInit() {
    this.timeSpanDefForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  findTimeSpan(): void {
    if (this.timeSpanDefForm.valid) {
    	var ts = {
    		startDate:null,
    		endDate:null
    	};
    	console.log("child side: ");
    	console.log(this.timeSpanDefForm.value);
    	ts.startDate = new Date(this.timeSpanDefForm.value.startDate + "T" + this.timeSpanDefForm.value.startTime + "Z");
    	ts.endDate = new Date(this.timeSpanDefForm.value.endDate + "T" + this.timeSpanDefForm.value.endTime + "Z");
    	this.onSubmitted.emit(ts);
    	console.log(ts);
      this.timeSpanDefForm.reset();
    }
  }
}