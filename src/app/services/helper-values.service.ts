import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class HelperValuesService {
  productId: number;
  yearId: number;
  trainingCategoryParentId: number;
  trainingCategoryChildId: number;
  constructor() {}
}
