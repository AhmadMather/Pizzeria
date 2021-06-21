import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PizzaService} from "../pizza-service/pizza.service";

@Component({
  selector: 'app-pizza-builder',
  templateUrl: './pizza-builder.component.html',
  styleUrls: ['./pizza-builder.component.scss']
})
export class PizzaBuilderComponent implements OnInit {
  sizeFormGroup: FormGroup;
  crustFormGroup: FormGroup;
  sauceFormGroup: FormGroup;
  sizes = ['Small', 'Medium', 'Large'];
  crusts = ['Thin', 'Pan'];
  sauces = ['Cheese', 'Hawaiian', 'Veggie'];
  order: any[] = [];

  constructor(private formBuilder: FormBuilder,
              private pizzaService: PizzaService) {
    this.sizeFormGroup = this.formBuilder.group({
      sizeCtrl: ['', Validators.required]
    });
    this.crustFormGroup = this.formBuilder.group({
      crustCtrl: ['', Validators.required]
    });
    this.sauceFormGroup = this.formBuilder.group({
      sauceCtrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  addPizza() {
    this.order.push({
      size: this.sizeFormGroup.value.sizeCtrl,
      crust: this.crustFormGroup.value.crustCtrl,
      sauce: this.sauceFormGroup.value.sauceCtrl
    })
  }

  placeOrder() {
    this.addPizza();
    console.log(this.order);
    this.pizzaService.placeOrder(this.order).subscribe(
      () => {
        alert('Order has been placed!');
        this.order = [];
      },
      () => {
        alert('Uh Oh, looks like something went wrong on our end!');
      }
    )
  }
}
