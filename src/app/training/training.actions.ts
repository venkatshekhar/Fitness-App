import { Action } from "@ngrx/store";
import { Excercise } from "./excercise.model";

export const SET_AVAILABLE_TRAININGS = '[Training] Set Available Training';
export const SET_FINISHED_TRAININGS = '[Training] Set Finished Training';
export const START_TRAINING = '[Training] Start Training';
export const STOP_TRAINING = ' [Training] Stop Training'; 

export class SetAvailableTrainings implements Action{
    readonly type: string =SET_AVAILABLE_TRAININGS;

    constructor(public payload: Excercise[]){}
}

export class SetFinishedTrainings implements Action{
    readonly type: string =SET_FINISHED_TRAININGS;   
    
    constructor(public payload: Excercise[]){} 
}

export class StartTraining implements Action{
    readonly type: string =START_TRAINING;   
    
    constructor(public payload: Excercise){} 
}

export class StopTraining implements Action{
    readonly type: string =STOP_TRAINING;  
    
    constructor(public payload: Excercise){} 
    
}

export type TrainingActions = SetAvailableTrainings | SetFinishedTrainings | StartTraining | StopTraining;