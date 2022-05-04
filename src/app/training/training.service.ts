import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Excercise } from "./excercise.model";

@Injectable()
export class TrainingService {

    excerciseChanged = new Subject<Excercise>();
    private availableExcercises: Excercise[] = []
    private runningExcercise: Excercise;
    exChanged = new Subject<Excercise[]>();

    constructor(private fireDB: AngularFirestore) { }

    private exercises: Excercise[] = [];
    fetchAvailableExcercises() {
        this.fireDB.collection('availableExercises').snapshotChanges().pipe(map((docArray: any[]) => {
            return docArray.map(doc => {
                return {
                    id: doc.payload.doc.id,
                    ...doc.payload.doc.data()
                }
            });
        })).subscribe((exercises: Excercise[])=>{
            this.availableExcercises= exercises;
            this.exChanged.next([...this.availableExcercises]);
        })
    }

    startExcercise(selectedId: string) {
        this.runningExcercise = this.availableExcercises.find(ex => ex.id === selectedId);
        this.excerciseChanged.next({ ...this.runningExcercise });
    }

    getRunningExcercise() {
        return { ...this.runningExcercise }
    }

    completeExercise() {
        this.exercises.push({ ...this.runningExcercise, date: new Date(), state: 'completed' });
        this.runningExcercise = null;
        this.excerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.runningExcercise,
            duration: this.runningExcercise.duration * (progress / 100),
            calories: this.runningExcercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExcercise = null;
        this.excerciseChanged.next(null);
    }

    getCompletedOrCancelledExcercises() {
        return this.exercises.slice();
    }


}