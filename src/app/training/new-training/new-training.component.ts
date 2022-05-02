import { Component, OnInit } from '@angular/core';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  excercises : Excercise[]=[];


  constructor(private trainingService : TrainingService) { }

  ngOnInit(): void {
    this.excercises= this.trainingService.getAvailableExcercises();
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExcercise(form.value.exercise);
  }

}
