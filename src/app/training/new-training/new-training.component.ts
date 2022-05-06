import { Component, OnDestroy, OnInit } from '@angular/core';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  excercises: Excercise[];
  exerciseSub: Subscription;
  isLoading= true;


  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSub = this.trainingService.exChanged.subscribe(excercises => {
      this.excercises = excercises;
      this.isLoading= false
    });
    this.trainingService.fetchAvailableExcercises();

  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExcercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
  }

}
