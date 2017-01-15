import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TestValues } from '../../../../../both/collections/test-values.collection';

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
      endDate: ['', Validators.required]
    });
  }

  findTimeSpan(): void {
    if (this.timeSpanDefForm.valid) {
    	this.onSubmitted.emit(this.timeSpanDefForm.value);
      this.timeSpanDefForm.reset();
    }
  }

  insertValue(): void {
    TestValues.insert({date: new Date(), value: Math.floor((Math.random() * 100) + 1)});
  }  
}