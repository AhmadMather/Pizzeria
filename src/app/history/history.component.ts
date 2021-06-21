import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PizzaService} from "../pizza-service/pizza.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  dataSource: any = new MatTableDataSource<any>();
  tempSource
  displayedColumns: string[] = ['Order_ID', 'Size', 'Crust', 'Flavor', 'Delete'];
  constructor(private pizzaService: PizzaService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.pizzaService.getOrders().subscribe(
      (data: any) => {
        console.log(data);
        this.dataSource = data?.token;
        this.tempSource = this.dataSource;
      },
      err => {
        console.log(err)
      }
    )
  }

  deleteRecord(row) {
    this.pizzaService.deleteOrders(row.Order_ID).subscribe(
      () => {
        this.dataSource = this.dataSource.filter(data => data.Order_ID !== row.Order_ID);
        this.tempSource = this.dataSource.filter(data => data.Order_ID !== row.Order_ID);
      },
      (err) => console.log(err)
    );
  }

  data(e) {
    if (e.target.value) {
      this.dataSource = this.tempSource;
     this.dataSource = this.dataSource?.filter(data =>{
       return data.Order_ID.toString() === e.target.value
     });
    } else {

      this.dataSource = this.tempSource;
    }
  }
}
