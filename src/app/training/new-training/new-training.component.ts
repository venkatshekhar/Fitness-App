import { Component, OnInit } from '@angular/core';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  excercises : Observable<any>;


  constructor(private trainingService : TrainingService, private fireDB: AngularFirestore) { }

  ngOnInit(): void {
    // this.excercises= this.trainingService.getAvailableExcercises();
    this.excercises = this.fireDB.collection('availableExercises').valueChanges();
  }

  onStartTraining(form: NgForm){
    this.trainingService.startExcercise(form.value.exercise);
  }

}
