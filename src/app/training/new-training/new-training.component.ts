import { Component, OnInit } from '@angular/core';
import { Excercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  excercises: Observable<Excercise[]>;


  constructor(private trainingService: TrainingService, private fireDB: AngularFirestore) { }

  ngOnInit(): void {
    // this.excercises= this.trainingService.getAvailableExcercises();
    this.excercises = this.fireDB.collection('availableExercises').snapshotChanges().pipe(map((docArray: any[]) => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        }
      });
    }))
    // .subscribe(result =>{
    //   console.log('result data :', result)
    // });
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExcercise(form.value.exercise);
  }

}
