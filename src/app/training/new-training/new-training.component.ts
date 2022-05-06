import { Component, OnDestroy, OnInit } from '@angular/core';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore'
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  excercises: Excercise[];
  private exerciseSub: Subscription;
  isLoading = true;
  private loadingSubs: Subscription;


  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.exerciseSub = this.trainingService.exChanged.subscribe(excercises => {
      this.excercises = excercises;
    });
    this.trainingService.fetchAvailableExcercises();

  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExcercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSub.unsubscribe();
    this.loadingSubs.unsubscribe();
  }

}
